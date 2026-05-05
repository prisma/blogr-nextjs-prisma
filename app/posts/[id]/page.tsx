import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { posts } from "@/lib/posts";

type PostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const post = posts.find((item) => item.id === id);

  if (!post) {
    notFound();
  }

  const title = post.published ? post.title : `${post.title} (Draft)`;

  return (
    <article className="panel">
      <h1>{title}</h1>
      <p className="meta">By {post.author?.name ?? "Unknown author"}</p>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </article>
  );
}
