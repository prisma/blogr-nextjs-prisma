import type { Metadata } from "next";
import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blogr",
  description: "A fullstack blog built with Next.js, Prisma, Auth.js, and Neon.",
};

async function signInWithGitHub() {
  "use server";
  await signIn("github", { redirectTo: "/" });
}

async function signOutUser() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <header className="header">
          <nav className="nav" aria-label="Main navigation">
            <Link href="/">Feed</Link>
            {session ? <Link href="/drafts">My drafts</Link> : null}
          </nav>
          <div className="header-actions">
            {session?.user ? (
              <>
                <span className="user">
                  {session.user.name ?? session.user.email}
                </span>
                <Link className="button secondary" href="/create">
                  New post
                </Link>
                <form action={signOutUser}>
                  <button type="submit">Log out</button>
                </form>
              </>
            ) : (
              <form action={signInWithGitHub}>
                <button type="submit">Log in</button>
              </form>
            )}
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
