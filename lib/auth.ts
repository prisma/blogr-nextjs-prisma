import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

type VercelUserInfo = {
  sub: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  picture?: string;
};

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return null;
  }

  const response = await fetch("https://api.vercel.com/login/oauth/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const userInfo = (await response.json()) as VercelUserInfo;

  if (!userInfo.sub) {
    return null;
  }

  return prisma.user.upsert({
    where: { vercelId: userInfo.sub },
    update: {
      email: userInfo.email,
      name: userInfo.name ?? userInfo.preferred_username,
      image: userInfo.picture,
    },
    create: {
      vercelId: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name ?? userInfo.preferred_username,
      image: userInfo.picture,
    },
  });
}
