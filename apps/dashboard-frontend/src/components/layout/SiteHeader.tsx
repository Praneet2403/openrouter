import { Logo } from "@/components/brand/Logo";
import ShinyText from "@/components/reactbits/ShinyText";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "react-router";

const navLinks = [
  { href: "/#models", label: "Models" },
  { href: "/#features", label: "Features" },
  { href: "/credits", label: "Pricing" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-10 md:flex">
          <a href={navLinks[0].href} className="text-[15px] font-medium text-foreground/85 transition-colors hover:text-foreground">
            {navLinks[0].label}
          </a>
          <Link to="/dashboard" className="flex items-center gap-1.5 text-[15px] font-medium">
            <Sparkles className="size-4 text-brand" />
            <ShinyText text="Smart Routing" color="#6047ff" shineColor="#c4b8ff" speed={3} delay={1.5} />
          </Link>
          {navLinks.slice(1).map(({ href, label }) =>
            href.startsWith("/#") ? (
              <a
                key={href}
                href={href}
                className="text-[15px] font-medium text-foreground/85 transition-colors hover:text-foreground"
              >
                {label}
              </a>
            ) : (
              <Link
                key={href}
                to={href}
                className="text-[15px] font-medium text-foreground/85 transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-6">
          <Link
            to="/signin"
            className="hidden text-[15px] font-medium text-foreground/85 transition-colors hover:text-foreground sm:inline"
          >
            Sign in
          </Link>
          <Button asChild className="h-10 rounded-lg px-5 text-[15px]">
            <Link to="/signup">Get API key</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
