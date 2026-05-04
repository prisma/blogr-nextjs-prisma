import Link from "next/link";
import ReactMarkdown from "react-markdown";
import type { Post } from "@/lib/posts";

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link className="post-card" href={`/posts/${post.id}`}>
      <h2>{post.title}</h2>
      <p className="meta">By {post.author?.name ?? "Unknown author"}</p>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </Link>
  );
}
