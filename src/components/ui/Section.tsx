interface SectionProps {
  children: React.ReactNode;
  id?: string;
  fullWidth?: boolean;
  darkBg?: boolean;
  padding?: "sm" | "md" | "lg";
}

const paddingMap = {
  sm: "py-10 md:py-10",
  md: "py-16 md:py-20",
  lg: "py-20 md:py-28",
};

export function Section({
  children,
  id,
  fullWidth = false,
  darkBg = false,
  padding = "md",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${darkBg ? "bg-[#16162A]" : "bg-transparent"} ${paddingMap[padding]} transition-colors duration-300`}
    >
      <div
        className={`${fullWidth ? "w-full" : "mx-auto max-w-[1100px]"} px-4`}
      >
        {children}
      </div>
    </section>
  );
}
