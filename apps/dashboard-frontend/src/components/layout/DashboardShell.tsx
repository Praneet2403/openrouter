import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/clerk-react";
import { CreditCard, KeyRound, LayoutDashboard } from "lucide-react";
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
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[15px] font-medium transition-colors",
              active
                ? "bg-brand-soft text-brand"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="relative min-h-screen bg-[#fbfbfd] text-foreground">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-border bg-white py-6 md:flex md:flex-col">
          <Logo className="mb-10 px-5" />
          <NavLinks className="flex-col px-3" />
          <div className="mt-auto space-y-4 px-5 pt-8">
            <UserButton showName />
            <Link
              to="/"
              className="block text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Back to site
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-border bg-white/80 px-4 py-3 backdrop-blur-md md:hidden">
            <div className="mb-3 flex items-center justify-between">
              <Logo />
              <UserButton />
            </div>
            <NavLinks className="overflow-x-auto pb-1" />
          </header>

          <main className="flex-1 px-4 py-10 sm:px-6 lg:px-12">
            <div className="mx-auto max-w-5xl space-y-8">
              <div>
                <h1 className="text-[32px] font-semibold tracking-[-0.03em]">{title}</h1>
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
