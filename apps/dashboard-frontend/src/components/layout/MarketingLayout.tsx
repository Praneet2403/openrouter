import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { cn } from "@/lib/utils";

type MarketingLayoutProps = {
  children: React.ReactNode;
  className?: string;
  /** Let sections run edge to edge instead of sitting in the centered column. */
  bleed?: boolean;
};

/** Faint oversized rounded frames in the page corners, echoing the routing lines. */
function CornerFrames() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] overflow-hidden">
      <div className="absolute -left-24 -top-24 h-[460px] w-[640px] rounded-[64px] border border-border/80" />
      <div className="absolute -right-32 -top-40 h-[320px] w-[760px] rounded-[64px] border border-border/80" />
      <div className="absolute -right-24 top-[200px] h-[300px] w-[420px] rounded-[64px] border border-border/60" />
      <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(ellipse_60%_40%_at_50%_45%,#ffffff_30%,transparent)]" />
    </div>
  );
}

export function MarketingLayout({ children, className, bleed = false }: MarketingLayoutProps) {
  return (
    <div className="relative isolate min-h-screen overflow-x-hidden bg-background text-foreground">
      <CornerFrames />
      <SiteHeader />
      <main
        className={cn(
          bleed ? "w-full pb-20" : "mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-8",
          className,
        )}
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
