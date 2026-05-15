import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { cn } from "@/lib/utils";

type MarketingLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export function MarketingLayout({ children, className }: MarketingLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(262_83%_58%_/_0.18),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-violet-500/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 -z-10 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl"
      />

      <SiteHeader />
      <main className={cn("mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-8", className)}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
