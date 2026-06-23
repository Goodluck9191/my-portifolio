"use client";

import Image from "next/image";
import { useSettings } from "@/components/providers/SettingsProvider";

const SITE_URL = "https://goodluckprosper.vercel.app";

export default function AuthorCard() {
  const githubUrl = useSettings("social_github", "https://github.com/goodluckprosper");
  const linkedinUrl = useSettings("social_linkedin", "https://linkedin.com/in/goodluckprosper");

  return (
    <div className="mt-10 rounded-lg border border-[#22223A] bg-[#0F0F1A] p-6">
      <div className="flex items-start gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-[#22223A] bg-[#16162A]">
          <Image
            src="/images/profile.jpg"
            alt="Goodluck Prosper"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-base font-semibold text-white">
            Goodluck Prosper
          </h3>
          <p className="mt-1 font-sans text-sm leading-relaxed text-[#7A7A9A]">
            Full-stack developer & software engineer. I write about web development, system design, and building products that scale.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs text-[#6C63FF] transition-colors hover:text-[#00D4FF]"
            >
              GitHub
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs text-[#6C63FF] transition-colors hover:text-[#00D4FF]"
            >
              LinkedIn
            </a>
            <a
              href={`${SITE_URL}/contact`}
              className="font-sans text-xs text-[#6C63FF] transition-colors hover:text-[#00D4FF]"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
