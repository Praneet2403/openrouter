import { cn } from "@/lib/utils";
import { CreditCard, KeyRound, Layers, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/api-keys", label: "API keys", icon: KeyRound },
  { to: "/credits", label: "Credits", icon: CreditCard },
] as const;

type DashboardShellProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
};

export function DashboardShell({ children, title, description }: DashboardShellProps) {
  const { pathname } = useLocation();

  const NavLinks = ({ className }: { className?: string }) => (
    <nav className={cn("flex gap-1", className)}>
      {navItems.map(({ to, label, icon: Icon }) => {
        const active = pathname === to || (to !== "/dashboard" && pathname.startsWith(to));
        return (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-violet-500/15 text-violet-200"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0 opacity-80" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_70%_45%_at_50%_-15%,hsl(262_83%_58%_/_0.12),transparent)]"
      />

      <div className="flex min-h-screen">
        <aside className="hidden w-56 shrink-0 border-r border-border/60 bg-card/30 py-6 backdrop-blur-sm md:flex md:flex-col">
          <Link to="/" className="mb-8 flex items-center gap-2 px-5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20">
              <Layers className="size-4" />
            </span>
            <span className="font-semibold tracking-tight">OpenRouter</span>
          </Link>
          <NavLinks className="flex-col px-3" />
          <div className="mt-auto px-5 pt-8">
            <Link
              to="/"
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Back to site
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur-md md:hidden">
            <Link to="/" className="mb-3 flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-md bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
                <Layers className="size-3.5" />
              </span>
              <span className="text-sm font-semibold">OpenRouter</span>
            </Link>
            <NavLinks className="overflow-x-auto pb-1" />
          </header>

          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-5xl space-y-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                {description ? <p className="mt-2 text-muted-foreground">{description}</p> : null}
              </div>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
