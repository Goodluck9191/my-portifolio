"use client";

import { ArrowRight } from "lucide-react";
import { useSettings } from "@/components/providers/SettingsProvider";

export function ContactCTA() {
  const heading = useSettings("cta_heading", "Have a project in mind?");
  const subtitle = useSettings("cta_subtitle", "Let's build something great together. Get in touch and let's discuss your idea.");
  const contactEmail = useSettings("contact_email", "goodluck@example.com");
  const ctaLabel = useSettings("cta_button_label", "Get In Touch");
  return (
    <section className="border-b border-[#22223A] bg-[#16162A] py-20 md:py-24">
      <div className="mx-auto max-w-[700px] px-4 text-center">
        <h2 className="font-display text-3xl font-extrabold text-white md:text-4xl">
          {heading}
        </h2>
        <p className="mx-auto mt-3 max-w-[700px] font-sans text-base text-[#7A7A9A]">
          {subtitle}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={`mailto:${contactEmail}`}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] px-7 py-[13px] font-sans text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
          >
            {ctaLabel} <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
