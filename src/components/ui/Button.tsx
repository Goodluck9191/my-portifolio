import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "icon";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-lg font-sans transition-all duration-150 ease-out",
        "hover:scale-[1.02] active:scale-[0.98]",
        "disabled:pointer-events-none disabled:opacity-40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        size === "sm" && "h-[32px] px-3 text-xs font-medium",
        size === "md" && "h-[44px] px-5 text-sm font-medium",
        size === "lg" && "h-[52px] px-6 text-base font-semibold",
        variant === "primary" &&
          "bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] text-white shadow-lg shadow-[#6C63FF]/25",
        variant === "secondary" &&
          "border border-[#22223A] bg-transparent text-white hover:bg-[rgba(108,99,255,0.06)]",
        variant === "ghost" &&
          "bg-transparent text-white hover:underline",
        variant === "icon" && "bg-transparent p-0 text-white hover:bg-white/10",
        variant === "icon" && size === "sm" && "h-[32px] w-[32px]",
        variant === "icon" && size === "md" && "h-[44px] w-[44px]",
        variant === "icon" && size === "lg" && "h-[52px] w-[52px]",
        className,
      )}
      {...props}
    >
      {loading ? (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            className="opacity-25"
          />
          <path
            d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
            fill="currentColor"
            className="opacity-75"
          />
        </svg>
      ) : (
        children
      )}
    </button>
  );
}
