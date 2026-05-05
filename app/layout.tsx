import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blogr",
  description: "A fullstack blog starter built with Next.js and Prisma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <nav className="nav" aria-label="Main navigation">
            <Link href="/">Feed</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
