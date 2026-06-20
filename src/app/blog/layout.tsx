import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "From the Blog — Goodluck Prosper",
  description:
    "Thoughts on web development, system design, and AI. Articles about React, Next.js, TypeScript, and modern web architecture.",
  openGraph: {
    title: "From the Blog — Goodluck Prosper",
    description:
      "Thoughts on web development, system design, and AI. Articles about React, Next.js, TypeScript, and modern web architecture.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "From the Blog — Goodluck Prosper",
    description:
      "Thoughts on web development, system design, and AI. Articles about React, Next.js, TypeScript, and modern web architecture.",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
