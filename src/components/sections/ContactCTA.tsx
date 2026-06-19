import { ArrowRight, ExternalLink } from "lucide-react";

export function ContactCTA() {
  return (
    <section className="border-b border-[#22223A] bg-[#16162A] py-20 md:py-24">
      <div className="mx-auto max-w-[700px] px-4 text-center">
        <h2 className="font-display text-3xl font-extrabold text-white md:text-4xl">
          Have a project in mind?
        </h2>
        <p className="mx-auto mt-3 max-w-[700px] font-sans text-base text-[#7A7A9A]">
          Let&apos;s build something great together. Get in touch and
          let&apos;s discuss your idea.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="mailto:goodluck@example.com"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] px-7 py-[13px] font-sans text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
          >
            Get In Touch <ArrowRight size={16} />
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[#22223A] bg-transparent px-7 py-[13px] font-sans text-[15px] font-semibold text-white transition-all duration-200 hover:border-[#6C63FF] hover:bg-[rgba(108,99,255,0.06)]"
          >
            View Resume <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
