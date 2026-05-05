import Link from "next/link";
import ReactMarkdown from "react-markdown";

export type PostCardData = {
  id: string;
  title: string;
  content: string | null;
  author: {
    name: string | null;
  } | null;
};

export default function PostCard({ post }: { post: PostCardData }) {
  return (
    <Link className="post-card" href={`/posts/${post.id}`}>
      <h2>{post.title}</h2>
      <p className="meta">By {post.author?.name ?? "Unknown author"}</p>
      {post.content ? <ReactMarkdown>{post.content}</ReactMarkdown> : null}
    </Link>
  );
}
