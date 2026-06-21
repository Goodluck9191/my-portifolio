"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Clock } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/ui/ContactForm";
import { useSettings } from "@/components/providers/SettingsProvider";

function GithubIcon({ size }: { size?: number }) {
  const s = size ?? 20;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ size }: { size?: number }) {
  const s = size ?? 20;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function useContactInfo() {
  const emailVal = useSettings("contact_email", "hello@goodluckprosper.dev");
  const githubVal = useSettings("social_github", "https://github.com/goodluckprosper");
  const linkedinVal = useSettings("social_linkedin", "https://linkedin.com/in/goodluckprosper");

  return [
    { icon: Mail, label: "Email", value: emailVal, href: `mailto:${emailVal}` },
    { icon: GithubIcon, label: "GitHub", value: githubVal, href: githubVal },
    { icon: LinkedinIcon, label: "LinkedIn", value: linkedinVal, href: linkedinVal },
  ];
}

export default function ContactPage() {
  const contactInfo = useContactInfo();
  const pageTitle = useSettings("contact_page_title", "Let's Work Together");
  const pageSubtitle = useSettings("contact_subtitle", "I'd love to hear about your project. Send me a message and I'll get back to you within 24 hours.");
  const availabilityText = useSettings("availability_text", "Available for work");
  const location = useSettings("contact_location", "Tanzania, East Africa");
  const timezone = useSettings("contact_timezone", "EAT (UTC+3)");
  const responseTime = useSettings("contact_response_time", "I typically respond within 24 hours.");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(data: Record<string, string>) {
    setLoading(true);
    try {
      const body: Record<string, string> = {
        name: data.name,
        email: data.email,
        message: data.message,
      };
      if (data.projectType) body.project_type = data.projectType;
      if (data.budget) body.budget = data.budget;

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to send");
      }

      setSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Section padding="sm">
        <div className="flex flex-col gap-4 pt-4">
          <nav className="flex items-center gap-2 font-mono text-xs text-[#7A7A9A]">
            <Link href="/" className="transition-colors hover:text-[#EEEEFF]">
              Home
            </Link>
            <span>&gt;</span>
            <span className="text-[#EEEEFF]">Contact</span>
          </nav>

          <div className="mb-1 inline-flex w-fit items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1.5 text-sm text-green-500">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {availabilityText}
          </div>

          <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
            {pageTitle}
          </h1>
          <p className="font-sans text-base text-[#7A7A9A]">
            {pageSubtitle}
          </p>
        </div>
      </Section>

      <Section>
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          <div className="flex-1">
            <ContactForm
              onSubmit={handleSubmit}
              loading={loading}
              success={success}
              error={error}
            />
          </div>

          <aside className="md:w-80 md:shrink-0">
            <div className="sticky top-24 flex flex-col gap-6 rounded-lg border border-[#2A2A38] bg-[#0F0F1A] p-6">
              <h2 className="font-display text-xl font-bold text-white">
                Get In Touch
              </h2>

              <div className="flex flex-col gap-4">
                {contactInfo.map(({ icon: Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 transition-opacity hover:opacity-80"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#6C63FF]/20 to-[#00D4FF]/20">
                      <Icon size={16} className="text-[#6C63FF]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-sans text-xs text-[#7A7A9A]">
                        {label}
                      </span>
                    </div>
                  </a>
                ))}
              </div>

              <hr className="border-[#2A2A38]" />

              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#7A7A9A]" />
                <div className="flex flex-col">
                  <span className="font-sans text-sm text-[#EEEEFF]">
                    {location}
                  </span>
                  <span className="font-sans text-xs text-[#7A7A9A]">
                    {timezone}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={16} className="mt-0.5 shrink-0 text-[#7A7A9A]" />
                <span className="font-sans text-sm text-[#7A7A9A]">
                  {responseTime}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
