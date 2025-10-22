import clsx from "clsx";

export type PillTone = "default" | "brand" | "success" | "warn" | "danger" | "muted";

interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: PillTone;
  children: React.ReactNode;
}

export function Pill({ tone = "default", className, children, ...rest }: PillProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
        {
          "bg-[rgba(90,169,255,0.14)] text-[color:var(--brand)]": tone === "brand",
          "bg-[rgba(126,231,135,0.16)] text-[color:var(--brand-alt)]": tone === "success",
          "bg-[rgba(255,184,107,0.16)] text-[color:var(--warn)]": tone === "warn",
          "bg-[rgba(255,107,122,0.18)] text-[color:var(--danger)]": tone === "danger",
          "bg-[rgba(255,255,255,0.08)] text-[color:var(--text-muted)]": tone === "muted",
          "bg-[rgba(255,255,255,0.12)] text-[color:var(--text-primary)]": tone === "default",
        },
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
