import Link from "next/link";
import { createPost } from "@/app/actions";
import { getCurrentUser } from "@/lib/auth";

export default async function CreatePage() {
  const user = await getCurrentUser();

  if (!user) {
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
