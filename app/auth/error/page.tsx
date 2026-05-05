import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="panel">
      <h1>Authentication error</h1>
      <p>Sign in could not be completed. Try signing in again.</p>
      <Link className="button" href="/api/auth/authorize">
        Sign in with Vercel
      </Link>
    </div>
  );
}
