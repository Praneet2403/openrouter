import { SessionRejectedBanner } from "@/components/auth/SessionRejectedBanner";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ErrorBanner, SuccessBanner } from "@/components/ui/alert-banner";
import CountUp from "@/components/reactbits/CountUp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiErrorMessage } from "@/lib/api-error";
import { useElysiaClient } from "@/providers/Eden";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Coins, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

const ONRAMP_AMOUNT = 1000;

type ProfileQueryData = { ok: false } | { ok: true; credits: number };

export function Credits() {
  const client = useElysiaClient();
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<ProfileQueryData> => {
      const res = await client.auth.profile.get();
      if (res.status === 401) return { ok: false };
      if (res.status === 200 && res.data) {
        return { ok: true, credits: res.data.credits };
      }
      throw new Error("Could not load your balance. Please refresh the page.");
    },
    retry: false,
  });

  const onrampMutation = useMutation({
    mutationFn: async () => {
      const res = await client.payments.onramp.post({});
      if (res.status === 200 && res.data) {
        return res.data;
      }
      // Eden puts non-2xx bodies on `error.value`, not `data`
      throw new Error(apiErrorMessage(res.error?.value, "Could not add credits. Please try again."));
    },
    onSuccess: data => {
      setErrorMessage(null);
      queryClient.setQueryData<ProfileQueryData>(["profile"], { ok: true, credits: data.credits });
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

  const sessionRejected = profileQuery.data?.ok === false;
  const balance = profileQuery.data?.ok ? profileQuery.data.credits : null;

  return (
    <DashboardShell
      title="Credits"
      description="Top up your balance to pay for model requests across providers."
    >
      {sessionRejected ? <SessionRejectedBanner /> : null}
      {profileQuery.isError ? <ErrorBanner message={profileQuery.error.message} /> : null}
      {errorMessage ? (
        <ErrorBanner message={errorMessage} onDismiss={() => setErrorMessage(null)} />
      ) : null}
      {successMessage ? (
        <SuccessBanner message={successMessage} onDismiss={() => setSuccessMessage(null)} />
      ) : null}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-sm font-medium text-muted-foreground">Current balance</CardTitle>
            <CardDescription className="sr-only">Account credit balance</CardDescription>
          </div>
          <Coins className="size-5 text-amber-500" />
        </CardHeader>
        <CardContent>
          {profileQuery.isLoading ? (
            <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading balance…
            </div>
          ) : balance === null ? (
            <p className="text-3xl font-bold text-muted-foreground">—</p>
          ) : (
            <p className="text-4xl font-semibold tabular-nums tracking-tight">
              <CountUp to={balance} separator="," />
              <span className="ml-2 text-lg font-normal text-muted-foreground">credits</span>
            </p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            Credits are spent as you call models through the gateway.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-emerald-50">
            <Sparkles className="size-5 text-emerald-700" />
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
            disabled={onrampMutation.isPending || profileQuery.isLoading || sessionRejected}
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
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
