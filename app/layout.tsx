import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blogr",
  description:
    "A fullstack blog built with Next.js, Prisma, Sign in with Vercel, and Prisma Postgres.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body>
        <header className="header">
          <nav className="nav" aria-label="Main navigation">
            <Link href="/">Feed</Link>
            {user ? <Link href="/drafts">My drafts</Link> : null}
          </nav>
          <div className="header-actions">
            {user ? (
              <>
                <span className="user">{user.name ?? user.email}</span>
                <Link className="button secondary" href="/create">
                  New post
                </Link>
                <form action="/api/auth/signout" method="post">
                  <button type="submit">Log out</button>
                </form>
              </>
            ) : (
              <Link className="button" href="/api/auth/authorize">
                Sign in with Vercel
              </Link>
            )}
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
