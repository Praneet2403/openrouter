import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Layers } from "lucide-react";
import { Link, useLocation } from "react-router";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/signin", label: "Sign in" },
] as const;

export function SiteHeader() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 transition group-hover:shadow-violet-500/40">
            <Layers className="size-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight">OpenRouter</span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              to={href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
                pathname === href ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link to="/signin">Sign in</Link>
          </Button>
          <Button
            size="sm"
            asChild
            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20 hover:from-violet-500 hover:to-indigo-500"
          >
            <Link to="/signup">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
