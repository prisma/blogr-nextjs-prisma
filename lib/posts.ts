export type Post = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  author: {
    name: string;
    email: string;
  } | null;
};

export const posts: Post[] = [
  {
    id: "1",
    title: "Prisma is the perfect ORM for Next.js",
    content:
      "[Prisma](https://github.com/prisma/prisma) and Next.js go _great_ together!",
    published: true,
    author: {
      name: "Nikolas Burk",
      email: "burk@prisma.io",
    },
  },
];
