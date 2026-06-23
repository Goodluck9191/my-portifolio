"use client";

import { useEffect, useState } from "react";

interface Heading {
  level: number;
  text: string;
  id: string;
}

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ids = headings.map((h) => h.id);
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );
    for (const el of elements) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [headings]);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  if (headings.length === 0) return null;

  return (
    <>
      <details
        className="rounded-lg border border-[#22223A] bg-[#0F0F1A] lg:hidden"
        open={open}
        onToggle={(e) => setOpen(e.currentTarget.open)}
      >
        <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 font-sans text-sm font-medium text-[#EEEEFF]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h8m-8 6h12" strokeLinecap="round" />
          </svg>
          On this page
        </summary>
        <nav className="border-t border-[#22223A] px-4 py-3">
          <ul className="flex flex-col gap-1">
            {headings.map((h) => (
              <li key={h.id}>
                <button
                  onClick={() => scrollTo(h.id)}
                  className={`w-full text-left font-sans text-sm transition-colors hover:text-[#6C63FF] ${
                    activeId === h.id ? "text-[#6C63FF]" : "text-[#7A7A9A]"
                  }`}
                  style={{ paddingLeft: `${(h.level - 2) * 12}px` }}
                >
                  {h.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </details>

      <nav className="hidden lg:block">
        <h3 className="mb-3 font-sans text-xs font-semibold uppercase tracking-wider text-[#7A7A9A]">
          On this page
        </h3>
        <ul className="flex flex-col gap-1.5 border-l border-[#22223A]">
          {headings.map((h) => (
            <li key={h.id}>
              <button
                onClick={() => scrollTo(h.id)}
                className={`block w-full border-l-2 py-1 pr-4 text-left font-sans text-sm transition-all ${
                  activeId === h.id
                    ? "border-[#6C63FF] text-[#6C63FF]"
                    : "border-transparent text-[#7A7A9A] hover:border-[#6C63FF]/50 hover:text-[#EEEEFF]"
                }`}
                style={{ paddingLeft: `${(h.level - 2) * 16 + 12}px` }}
              >
                {h.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
