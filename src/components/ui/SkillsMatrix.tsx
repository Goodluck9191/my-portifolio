"use client";

import { motion } from "framer-motion";

interface Skill {
  label: string;
  percentage: number;
}

interface SkillsMatrixProps {
  skills: Skill[];
}

export function SkillsMatrix({ skills }: SkillsMatrixProps) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {skills.map((skill, i) => (
        <motion.div
          key={skill.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[20px] text-[#EEEEFF]">
              {skill.label}
            </h3>
            <span className="font-sans text-sm text-[#7A7A9A]">
              {skill.percentage}%
            </span>
          </div>
          <div className="h-1 w-full rounded-full bg-[#1A1A24]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-[#00D4FF]"
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.percentage}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: "easeOut", delay: i * 0.1 + 0.2 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
