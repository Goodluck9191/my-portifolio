interface SkillBadgeProps {
  label: string;
  color: string;
  size?: "sm" | "md" | "lg";
}

export function SkillBadge({ label, color, size = "md" }: SkillBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-[#22223A] bg-[#16162A] font-mono text-[#7A7A9A] transition-all duration-200 ease-out hover:border-[#6C63FF]"
      style={{
        padding: size === "sm" ? "4px 10px" : size === "lg" ? "8px 16px" : "6px 12px",
        fontSize: size === "sm" ? "10px" : size === "lg" ? "13px" : "12px",
      }}
    >
      <span
        className="shrink-0 rounded-full"
        style={{
          width: size === "sm" ? 3 : size === "lg" ? 5 : 4,
          height: size === "sm" ? 3 : size === "lg" ? 5 : 4,
          backgroundColor: color,
        }}
      />
      {label}
    </span>
  );
}
