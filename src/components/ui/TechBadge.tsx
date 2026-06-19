interface TechBadgeProps {
  label: string;
  color?: string;
  icon?: React.ReactNode;
}

const presetColors: Record<string, string> = {
  accent: "#6C63FF",
  cyan: "#00D4FF",
  success: "#10B981",
};

export function TechBadge({ label, color = "#6C63FF", icon }: TechBadgeProps) {
  const dotColor = presetColors[color] ?? color;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2A2A38] bg-[#16162A] px-[10px] py-[4px] font-mono text-[11px] text-[#7A7A9A] transition-all duration-200 ease-out hover:border-[#6C63FF]">
      {icon}
      <span
        className="shrink-0 rounded-full"
        style={{ width: 6, height: 6, backgroundColor: dotColor }}
      />
      {label}
    </span>
  );
}
