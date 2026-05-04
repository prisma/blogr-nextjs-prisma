import Link from "next/link";
import { auth } from "@/auth";
import { createPost } from "@/app/actions";

export default async function CreatePage() {
  const session = await auth();

  if (!session?.user?.email) {
    return (
      <div className="panel">
        <h1>New Draft</h1>
        <p>You need to be authenticated to create a post.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <form action={createPost} className="form">
        <h1>New Draft</h1>
        <label className="field">
          <span>Title</span>
          <input autoFocus name="title" placeholder="Title" required />
        </label>
        <label className="field">
          <span>Content</span>
          <textarea name="content" placeholder="Content" required />
        </label>
        <div className="actions">
          <button type="submit">Create</button>
          <Link className="button secondary" href="/">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
