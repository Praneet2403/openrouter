import { LogoMark } from "@/components/brand/Logo";
import { Link } from "react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row sm:px-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LogoMark className="size-5" />
          <span>OpenRouter — one API for every model</span>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link to="/signup" className="transition-colors hover:text-foreground">
            Sign up
          </Link>
          <Link to="/signin" className="transition-colors hover:text-foreground">
            Sign in
          </Link>
          <Link to="/dashboard" className="transition-colors hover:text-foreground">
            Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}
