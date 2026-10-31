import { cn } from "@/lib/utils";
import { Link } from "react-router";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-7", className)}>
      <defs>
        <linearGradient id="logo-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd36b" />
          <stop offset="1" stopColor="#f5a524" />
        </linearGradient>
        <linearGradient id="logo-b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f5a524" stopOpacity="0.55" />
          <stop offset="1" stopColor="#e07b12" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <path d="M4 16 13 7l9 9-9 9z" fill="url(#logo-b)" />
      <path d="M10 16l9-9 9 9-9 9z" fill="url(#logo-a)" />
    </svg>
  );
}

export function Logo({ className, to = "/" }: { className?: string; to?: string }) {
  return (
    <Link to={to} className={cn("flex items-center gap-2", className)}>
      <LogoMark />
      <span className="text-[19px] font-semibold tracking-[-0.02em] text-foreground">OpenRouter</span>
    </Link>
  );
}
