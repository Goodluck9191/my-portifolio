import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Syne } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Analytics from "@/components/providers/Analytics";
import SettingsWrapper from "@/components/providers/SettingsWrapper";
import { getAllSettings } from "@/lib/data";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
});

const defaultTitle = "Goodluck Prosper — Full Stack Developer";
const defaultDescription =
  "Full stack developer specializing in React, Next.js & Node.js. I build clean, fast websites that help businesses grow online.";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAllSettings().catch(() => ({} as Record<string, string>));
  return {
    title: settings.site_title ?? defaultTitle,
    description: settings.site_description ?? defaultDescription,
    metadataBase: new URL("https://goodluckprosper.vercel.app"),
    alternates: {
      canonical: "/",
    },
    other: {
      ...(settings.google_verification_code
        ? { "google-site-verification": settings.google_verification_code }
        : {}),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Analytics />
        <SettingsWrapper>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </SettingsWrapper>
      </body>
    </html>
  );
}
