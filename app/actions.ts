"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function createPost(formData: FormData) {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    redirect("/api/auth/signin");
  }

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!title || !content) {
    throw new Error("Title and content are required.");
  }

  await prisma.post.create({
    data: {
      title,
      content,
      author: { connect: { email } },
    },
  });

  revalidatePath("/drafts");
  redirect("/drafts");
}

export async function publishPost(id: string) {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    redirect("/api/auth/signin");
  }

  const post = await prisma.post.findUnique({
    where: { id },
    select: { author: { select: { email: true } } },
  });

  if (post?.author?.email !== email) {
    throw new Error("You can only publish your own posts.");
  }

  await prisma.post.update({
    where: { id },
    data: { published: true },
  });

  revalidatePath("/");
  revalidatePath(`/posts/${id}`);
  revalidatePath("/drafts");
  redirect("/");
}

export async function deletePost(id: string) {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    redirect("/api/auth/signin");
  }

  const post = await prisma.post.findUnique({
    where: { id },
    select: { author: { select: { email: true } } },
  });

  if (post?.author?.email !== email) {
    throw new Error("You can only delete your own posts.");
  }

  await prisma.post.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/drafts");
  redirect("/");
}
