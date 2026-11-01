import { RouterDiagram } from "@/components/landing/RouterDiagram";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import BlurText from "@/components/reactbits/BlurText";
import FadeContent from "@/components/reactbits/FadeContent";
import LogoLoop, { type LogoItem } from "@/components/reactbits/LogoLoop";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import { Button } from "@/components/ui/button";
import { useElysiaClient } from "@/providers/Eden";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CreditCard, KeyRound, Layers, Loader2 } from "lucide-react";
import { Link } from "react-router";

const features = [
  {
    icon: Layers,
    title: "One API, every model",
    description:
      "Route requests across OpenAI, Anthropic, Google, and more through a single OpenAI-compatible endpoint.",
  },
  {
    icon: CreditCard,
    title: "Pay-as-you-go credits",
    description:
      "Top up credits on demand. No subscriptions — only pay for what you use across providers.",
  },
  {
    icon: KeyRound,
    title: "API keys you control",
    description:
      "Create, disable, and rotate keys from your dashboard. Track usage per key in real time.",
  },
] as const;

const providerNames = ["OpenAI", "Anthropic", "Google", "Meta", "Mistral", "DeepSeek", "xAI", "Cohere", "Qwen"];

const providerLogos: LogoItem[] = providerNames.map(name => ({
  title: name,
  node: (
    <span className="text-[26px] font-semibold tracking-[-0.03em] text-foreground/30 transition-colors hover:text-foreground/70">
      {name}
    </span>
  ),
}));

export function Landing() {
  const client = useElysiaClient();

  const modelsQuery = useQuery({
    queryKey: ["models"],
    queryFn: async () => {
      const { data, error } = await client.models.get();
      if (error) throw error;
      return data?.models ?? [];
    },
  });

  const previewModels = (modelsQuery.data ?? []).slice(0, 6);

  return (
    <MarketingLayout bleed>
      <section className="mx-auto flex max-w-4xl flex-col items-center px-4 pt-20 text-center sm:pt-28">
        <h1 className="sr-only">One API for every AI model</h1>
        <div aria-hidden className="text-[44px] font-semibold leading-[1.05] tracking-[-0.045em] text-foreground sm:text-[76px]">
          <BlurText text="One API for" animateBy="words" delay={90} trigger="load" className="justify-center" />
          <BlurText text="every AI model" animateBy="words" delay={90} trigger="load" className="justify-center" />
        </div>
        <FadeContent trigger="mount" delay={0.5} duration={0.8} blur>
          <p className="mx-auto mt-7 max-w-xl text-[17px] leading-relaxed text-muted-foreground sm:text-lg">
            Connect, compare, and route requests to any LLM — all through one OpenAI-compatible endpoint.
          </p>
          <Button asChild className="mt-9 h-12 rounded-lg px-7 text-base shadow-[0_8px_24px_-8px_rgba(14,16,51,0.5)]">
            <Link to="/signup">Get your API key</Link>
          </Button>
        </FadeContent>
      </section>

      <section className="mt-14 sm:mt-20">
        <RouterDiagram />
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4 text-center sm:mt-24">
        <p className="text-[17px] font-medium text-foreground/80">Works with every major model provider</p>
        <div className="mt-8">
          <LogoLoop
            logos={providerLogos}
            speed={50}
            gap={72}
            logoHeight={32}
            pauseOnHover
            fadeOut
            fadeOutColor="#ffffff"
            ariaLabel="Supported model providers"
          />
        </div>
      </section>

      <section id="features" className="mx-auto mt-32 max-w-6xl scroll-mt-24 px-4 sm:px-6 lg:px-8">
        <FadeContent className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">Why OpenRouter</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-[44px] sm:leading-tight">
            Everything you need to ship AI features
          </h2>
        </FadeContent>
        <FadeContent className="mt-14 grid gap-5 sm:grid-cols-3" stagger={0.12}>
          {features.map(({ icon: Icon, title, description }) => (
            <SpotlightCard key={title} theme="light" spotlightColor="#6047ff" intensity={0.12} className="text-left">
              <div className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-6 text-lg font-semibold tracking-[-0.01em]">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{description}</p>
            </SpotlightCard>
          ))}
        </FadeContent>
      </section>

      <section id="models" className="mx-auto mt-32 max-w-6xl scroll-mt-24 space-y-8 px-4 sm:px-6 lg:px-8">
        <FadeContent className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.03em]">Available models</h2>
            <p className="mt-2 text-muted-foreground">
              Browse models and providers from your dashboard after signing up.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-[15px] font-medium text-brand hover:underline"
          >
            View dashboard
            <ArrowRight className="size-4" />
          </Link>
        </FadeContent>

        <FadeContent className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_1px_2px_rgba(11,13,38,0.04),0_24px_48px_-32px_rgba(11,13,38,0.2)]">
          {modelsQuery.isLoading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
              Loading models…
            </div>
          ) : modelsQuery.isError ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Couldn't load the model list right now. Please try again shortly.
            </p>
          ) : previewModels.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">No models available yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {previewModels.map(model => (
                <li
                  key={model.id}
                  className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-muted/60"
                >
                  <div className="min-w-0 text-left">
                    <p className="font-medium">{model.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{model.company.name}</p>
                  </div>
                  <code className="shrink-0 rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                    {model.slug}
                  </code>
                </li>
              ))}
            </ul>
          )}
        </FadeContent>
      </section>

      <section className="mx-auto mt-32 max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeContent className="relative overflow-hidden rounded-3xl bg-primary px-8 py-14 text-center text-primary-foreground sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_120%,rgba(96,71,255,0.55),transparent)]"
          />
          <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-[48px] border border-white/10" />
          <div aria-hidden className="pointer-events-none absolute -bottom-28 -right-16 size-80 rounded-[48px] border border-white/10" />
          <h2 className="relative text-3xl font-semibold tracking-[-0.03em] sm:text-[44px] sm:leading-tight">
            Ready to route your first request?
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-white/65">
            Create an account, grab an API key, and start calling models in minutes.
          </p>
          <Button
            asChild
            className="relative mt-9 h-12 rounded-lg bg-white px-7 text-base text-primary hover:bg-white/90"
          >
            <Link to="/signup">
              Create free account
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </FadeContent>
      </section>
    </MarketingLayout>
  );
}
