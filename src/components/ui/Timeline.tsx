"use client";

import { motion } from "framer-motion";
import { TechStackIcon } from "@/components/ui/TechStackIcon";

interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  company?: string;
  location?: string;
  tech?: string[];
}

interface TimelineProps {
  entries: TimelineEntry[];
}

export function Timeline({ entries }: TimelineProps) {
  return (
    <div className="relative pl-8 md:pl-0">
      <div className="absolute left-[3px] top-2 h-[calc(100%-16px)] w-px bg-[#2A2A38] md:left-1/2 md:-translate-x-px" />

      <div className="flex flex-col gap-10">
        {entries.map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.12 }}
            className="relative md:flex md:w-full"
          >
            <div className="hidden md:flex md:w-1/2 md:items-start md:justify-end md:pr-12">
              <span className="font-mono text-xs text-[#7A7A9A]">
                {entry.year}
              </span>
            </div>

            <div className="relative flex items-start gap-4 md:w-1/2 md:pl-12">
              <span className="absolute left-[-29px] top-[6px] h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] md:left-[-33px]" />

              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-xs text-[#7A7A9A] md:hidden">
                  {entry.year}
                </span>

                <h3 className="font-sans text-lg font-semibold text-white">
                  {entry.title}
                </h3>

                {(entry.company || entry.location) && (
                  <p className="font-sans text-sm text-[#7A7A9A]">
                    {[entry.company, entry.location].filter(Boolean).join(" · ")}
                  </p>
                )}

                <p className="font-sans text-sm leading-relaxed text-[#7A7A9A]">
                  {entry.description}
                </p>

                {entry.tech && entry.tech.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {entry.tech.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#2A2A38] bg-[#16162A] px-2.5 py-0.5 font-mono text-[11px] text-[#7A7A9A] transition-all duration-200 hover:border-[#6C63FF]"
                      >
                        <TechStackIcon name={t} size={11} />
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
