import clsx from "clsx";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "brand" | "success" | "warn" | "muted";
  children: React.ReactNode;
}

export function Badge({ tone = "muted", className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium uppercase tracking-wide",
        {
          "border-[rgba(90,169,255,0.3)] bg-[rgba(90,169,255,0.12)] text-[color:var(--brand)]":
            tone === "brand",
          "border-[rgba(126,231,135,0.3)] bg-[rgba(126,231,135,0.12)] text-[color:var(--brand-alt)]":
            tone === "success",
          "border-[rgba(255,184,107,0.3)] bg-[rgba(255,184,107,0.12)] text-[color:var(--warn)]":
            tone === "warn",
          "border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.08)] text-[color:var(--text-muted)]":
            tone === "muted",
        },
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
