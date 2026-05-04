import PostCard, { type PostCardData } from "@/components/post-card";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function DraftsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="panel">
        <h1>My Drafts</h1>
        <p>You need to be authenticated to view this page.</p>
      </div>
    );
  }

  const drafts = await prisma.post.findMany({
    where: {
      authorId: user.id,
      published: false,
    },
    include: {
      author: {
        select: { name: true },
      },
    },
    orderBy: { id: "desc" },
  });

  return (
    <div className="stack">
      <h1>My Drafts</h1>
      {drafts.length ? (
        drafts.map((post: PostCardData) => <PostCard key={post.id} post={post} />)
      ) : (
        <div className="panel">You do not have any drafts yet.</div>
      )}
    </div>
  );
}
