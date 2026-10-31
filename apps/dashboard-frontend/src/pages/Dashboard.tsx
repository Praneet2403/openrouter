import { DashboardShell } from "@/components/layout/DashboardShell";
import { ErrorBanner } from "@/components/ui/alert-banner";
import CountUp from "@/components/reactbits/CountUp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchApiKeys } from "@/lib/fetch-api-keys";
import { useElysiaClient } from "@/providers/Eden";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Box, KeyRound, Loader2, Sparkles, Zap } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";

export function Dashboard() {
  const client = useElysiaClient();
  const navigate = useNavigate();

  const modelsQuery = useQuery({
    queryKey: ["models"],
    queryFn: async () => {
      const { data, error } = await client.models.get();
      if (error) {
        throw new Error("Could not load models. Is the API running on port 3000?");
      }
      return data?.models ?? [];
    },
  });

  const apiKeysQuery = useQuery({
    queryKey: ["api-keys"],
    queryFn: () => fetchApiKeys(client),
  });

  useEffect(() => {
    if (apiKeysQuery.data?.ok === false) {
      navigate("/signin", { replace: true });
    }
  }, [apiKeysQuery.data, navigate]);

  const keys = apiKeysQuery.data?.ok ? (apiKeysQuery.data.apiKeys ?? []) : [];
  const activeKeyCount = keys.filter(k => !k.disabled).length;
  const totalCreditsConsumed = keys.reduce((sum, k) => sum + k.creditsConsumed, 0);
  const modelCount = modelsQuery.data?.length ?? 0;

  const authLoading = apiKeysQuery.isLoading || apiKeysQuery.isFetching;

  return (
    <DashboardShell
      title="Overview"
      description="Route traffic across providers, monitor keys, and top up credits from one place."
    >
      {apiKeysQuery.isError ? (
        <ErrorBanner
          message={
            apiKeysQuery.error instanceof Error
              ? apiKeysQuery.error.message
              : "Could not load API keys."
          }
        />
      ) : null}

      {modelsQuery.isError ? (
        <ErrorBanner
          message={
            modelsQuery.error instanceof Error
              ? modelsQuery.error.message
              : "Could not load models."
          }
        />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Models available</CardTitle>
            <Box className="size-4 text-brand" />
          </CardHeader>
          <CardContent>
            {modelsQuery.isLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading…
              </div>
            ) : modelsQuery.isError ? (
              <p className="text-sm text-muted-foreground">Unavailable</p>
            ) : (
              <CountUp to={modelCount} className="block text-3xl font-semibold tracking-tight tabular-nums" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">API keys</CardTitle>
            <KeyRound className="size-4 text-brand" />
          </CardHeader>
          <CardContent>
            {authLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading…
              </div>
            ) : apiKeysQuery.isError ? (
              <p className="text-sm text-muted-foreground">Unavailable</p>
            ) : (
              <>
                <CountUp to={keys.length} className="block text-3xl font-semibold tracking-tight tabular-nums" />
                <p className="text-xs text-muted-foreground">{activeKeyCount} active</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Credits used (keys)</CardTitle>
            <Zap className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            {authLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading…
              </div>
            ) : apiKeysQuery.isError ? (
              <p className="text-sm text-muted-foreground">Unavailable</p>
            ) : (
              <CountUp to={totalCreditsConsumed} separator="," className="block text-3xl font-semibold tracking-tight tabular-nums" />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-brand-soft">
              <KeyRound className="size-5 text-brand" />
            </div>
            <CardTitle>Manage API keys</CardTitle>
            <CardDescription>Create, disable, and track usage for each integration.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
            >
              <Link to="/api-keys">
                Open API keys
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-emerald-50">
              <Sparkles className="size-5 text-emerald-700" />
            </div>
            <CardTitle>Add credits</CardTitle>
            <CardDescription>Top up your balance to keep requests flowing.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="border-border/80 bg-background/50">
              <Link to="/credits">
                Go to credits
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {!modelsQuery.isLoading && !modelsQuery.isError && (modelsQuery.data?.length ?? 0) > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Featured models</CardTitle>
            <CardDescription>A sample of what you can call through the gateway.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border/60">
              {(modelsQuery.data ?? []).slice(0, 5).map(model => (
                <li key={model.id} className="flex items-center justify-between gap-4 px-6 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium">{model.name}</p>
                    <p className="truncate text-muted-foreground">{model.company.name}</p>
                  </div>
                  <code className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {model.slug}
                  </code>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </DashboardShell>
  );
}
