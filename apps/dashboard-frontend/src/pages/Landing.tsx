import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useElysiaClient } from "@/providers/Eden";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CreditCard,
  KeyRound,
  Layers,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";
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
    <MarketingLayout>
      <section className="flex flex-col items-center gap-8 pb-20 pt-12 text-center sm:pt-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300">
          <Sparkles className="size-3.5" />
          Unified LLM routing platform
        </div>

        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl sm:leading-[1.1]">
            One API for{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
              every model
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Ship AI features faster. OpenRouter routes your requests to the best provider with transparent
            pricing and a developer-first dashboard.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            asChild
            className="h-11 bg-gradient-to-r from-violet-600 to-indigo-600 px-8 text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-indigo-500"
          >
            <Link to="/signup">
              Start building
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="h-11 border-border/80 bg-background/50">
            <Link to="/signin">Sign in</Link>
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Zap className="size-4 text-amber-400" />
            OpenAI-compatible
          </span>
          <span className="flex items-center gap-1.5">
            <KeyRound className="size-4 text-violet-400" />
            Per-key usage tracking
          </span>
          <span className="flex items-center gap-1.5">
            <CreditCard className="size-4 text-emerald-400" />
            Credit-based billing
          </span>
        </div>
      </section>

      <section className="grid gap-6 pb-20 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <Card
            key={title}
            className="border-border/60 bg-card/50 backdrop-blur-sm transition hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5"
          >
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
                <Icon className="size-5" />
              </div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="space-y-6 pb-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Available models</h2>
            <p className="text-muted-foreground">
              Browse models and providers from your dashboard after signing up.
            </p>
          </div>
          <Button variant="ghost" asChild className="text-violet-400 hover:text-violet-300">
            <Link to="/dashboard">
              View dashboard
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <Card className="border-border/60 bg-card/40 backdrop-blur-sm">
          <CardContent className="p-0">
            {modelsQuery.isLoading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
                <Loader2 className="size-5 animate-spin" />
                Loading models…
              </div>
            ) : modelsQuery.isError ? (
              <p className="py-16 text-center text-sm text-muted-foreground">
                Models will appear here when the API is running on port 3000.
              </p>
            ) : previewModels.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">No models available yet.</p>
            ) : (
              <ul className="divide-y divide-border/60">
                {previewModels.map(model => (
                  <li
                    key={model.id}
                    className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-muted/30"
                  >
                    <div className="min-w-0 text-left">
                      <p className="font-medium">{model.name}</p>
                      <p className="truncate text-sm text-muted-foreground">{model.company.name}</p>
                    </div>
                    <code className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                      {model.slug}
                    </code>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-transparent to-indigo-500/10 p-8 text-center sm:p-12">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Ready to route your first request?</h2>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          Create an account, grab an API key, and start calling models in minutes.
        </p>
        <Button
          size="lg"
          asChild
          className="mt-8 bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500"
        >
          <Link to="/signup">
            Create free account
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </section>
    </MarketingLayout>
  );
}
