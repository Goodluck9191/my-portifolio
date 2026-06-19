"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ease-out ${
        scrolled
          ? "border-b border-[#22223A] bg-[rgba(8,8,14,0.92)] backdrop-blur-[16px]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-[15px] font-medium tracking-tight"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className="bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] bg-clip-text text-transparent">
            GP
          </span>
          <span className="text-[#7A7A9A]">.dev</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-[#7A7A9A] transition-colors duration-200 hover:text-[#EEEEFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(8,8,14,0.92)]"
            >
              {label}
            </Link>
          ))}
          <a
            href="/#contact"
            className="rounded-lg bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] px-[18px] py-2 text-[13px] font-semibold text-white transition-all duration-200 hover:scale-[1.03] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(8,8,14,0.92)]"
          >
            Hire Me
          </a>
        </div>

        <button
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex h-8 w-8 items-center justify-center md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(8,8,14,0.92)]"
        >
          {mobileOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EEEEFF" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EEEEFF" strokeWidth="2" strokeLinecap="round">
              <path d="M3 6h18" />
              <path d="M3 12h18" />
              <path d="M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-out md:hidden ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-[#22223A] bg-[#0F0F1A]">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={closeMobile}
              className="block border-b border-white/5 px-4 py-4 text-base text-[#EEEEFF] transition-colors hover:text-[#6C63FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#6C63FF]"
            >
              {label}
            </Link>
          ))}
          <div className="px-4 py-4">
            <a
              href="/#contact"
              onClick={closeMobile}
              className="block w-full rounded-lg bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] px-[18px] py-3 text-center text-[13px] font-semibold text-white transition-all duration-200 hover:scale-[1.03] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF]"
            >
              Hire Me
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
