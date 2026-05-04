import PostCard from "@/components/post-card";
import { posts } from "@/lib/posts";

export default function FeedPage() {
  return (
    <div className="stack">
      <h1>Public Feed</h1>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
