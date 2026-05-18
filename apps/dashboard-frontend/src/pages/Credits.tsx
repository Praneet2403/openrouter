import { DashboardShell } from "@/components/layout/DashboardShell";
import { ErrorBanner, SuccessBanner } from "@/components/ui/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiErrorMessage } from "@/lib/api-error";
import { fetchApiKeys } from "@/lib/fetch-api-keys";
import { useElysiaClient } from "@/providers/Eden";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Coins, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const ONRAMP_AMOUNT = 1000;

export function Credits() {
  const client = useElysiaClient();
  const navigate = useNavigate();
  const [balance, setBalance] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const authQuery = useQuery({
    queryKey: ["api-keys"],
    queryFn: () => fetchApiKeys(client),
    retry: false,
  });

  useEffect(() => {
    if (authQuery.data?.ok === false) {
      navigate("/signin", { replace: true });
    }
  }, [authQuery.data, navigate]);

  const onrampMutation = useMutation({
    mutationFn: async () => {
      const res = await client.payments.onramp.post({});
      if (res.status === 401) {
        navigate("/signin", { replace: true });
        throw new Error("You are not signed in. Please sign in and try again.");
      }
      if (res.status === 200 && res.data) {
        return res.data;
      }
      throw new Error(apiErrorMessage(res.data, "Could not add credits. Please try again."));
    },
    onSuccess: data => {
      setErrorMessage(null);
      setBalance(data.credits);
      setSuccessMessage(
        `Successfully added ${ONRAMP_AMOUNT.toLocaleString()} credits. Your new balance is ${data.credits.toLocaleString()} credits.`,
      );
    },
    onError: err => {
      setSuccessMessage(null);
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong while adding credits.",
      );
    },
  });

  const authError =
    authQuery.error instanceof Error
      ? authQuery.error.message
      : authQuery.isError
        ? "Could not verify your session."
        : null;

  return (
    <DashboardShell
      title="Credits"
      description="Top up your balance to pay for model requests across providers."
    >
      {authError ? <ErrorBanner message={authError} /> : null}
      {errorMessage ? (
        <ErrorBanner message={errorMessage} onDismiss={() => setErrorMessage(null)} />
      ) : null}
      {successMessage ? (
        <SuccessBanner message={successMessage} onDismiss={() => setSuccessMessage(null)} />
      ) : null}

      <Card className="border-border/60 bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-sm font-medium text-muted-foreground">Current balance</CardTitle>
            <CardDescription className="sr-only">Account credit balance</CardDescription>
          </div>
          <Coins className="size-5 text-amber-400" />
        </CardHeader>
        <CardContent>
          {balance === null ? (
            <p className="text-3xl font-bold text-muted-foreground">—</p>
          ) : (
            <p className="text-4xl font-bold tabular-nums tracking-tight">
              {balance.toLocaleString()}
              <span className="ml-2 text-lg font-normal text-muted-foreground">credits</span>
            </p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            Balance updates after you add credits below.
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-gradient-to-br from-emerald-500/10 via-card/80 to-transparent backdrop-blur-sm">
        <CardHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-emerald-500/15">
            <Sparkles className="size-5 text-emerald-300" />
          </div>
          <CardTitle>Add credits</CardTitle>
          <CardDescription>
            Dev onramp adds {ONRAMP_AMOUNT.toLocaleString()} credits instantly. Payment providers
            (Stripe / Razorpay) will replace this flow later.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-sm">
            <p className="font-medium">+{ONRAMP_AMOUNT.toLocaleString()} credits</p>
            <p className="mt-1 text-muted-foreground">One-click test top-up for development</p>
          </div>
          <Button
            onClick={() => {
              setSuccessMessage(null);
              setErrorMessage(null);
              onrampMutation.mutate();
            }}
            disabled={onrampMutation.isPending || authQuery.isLoading}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500"
          >
            {onrampMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <Coins className="size-4" />
                Add {ONRAMP_AMOUNT.toLocaleString()} credits
              </>
            )}
          </Button>
          {authQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Checking your session…</p>
          ) : null}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
