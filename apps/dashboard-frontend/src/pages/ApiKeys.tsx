import { DashboardShell } from "@/components/layout/DashboardShell";
import { ErrorBanner, SuccessBanner } from "@/components/ui/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { apiErrorMessage } from "@/lib/api-error";
import { fetchApiKeys } from "@/lib/fetch-api-keys";
import { maskApiKey } from "@/lib/mask-api-key";
import { cn } from "@/lib/utils";
import { useElysiaClient } from "@/providers/Eden";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Copy, KeyRound, Loader2, Plus, Power, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

const createKeySchema = z.object({
  name: z.string().min(1, "Name is required").max(64, "Name is too long"),
});

type CreateKeyFormValues = z.infer<typeof createKeySchema>;

type RevealedKey = {
  id: string;
  name: string;
  apiKey: string;
  copied: boolean;
};

function formatLastUsed(value: Date | string | null) {
  if (!value) return "Never";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Never";
  return date.toLocaleString();
}

export function ApiKeys() {
  const client = useElysiaClient();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [revealedKey, setRevealedKey] = useState<RevealedKey | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const form = useForm<CreateKeyFormValues>({
    resolver: zodResolver(createKeySchema),
    defaultValues: { name: "" },
  });

  const keysQuery = useQuery({
    queryKey: ["api-keys"],
    queryFn: () => fetchApiKeys(client),
  });

  useEffect(() => {
    if (keysQuery.data?.ok === false) {
      navigate("/signin", { replace: true });
    }
  }, [keysQuery.data, navigate]);

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await client["api-keys"].post({ name });
      if (res.status !== 200 || !res.data) {
        throw new Error(apiErrorMessage(res.data, "Failed to create API key. Please try again."));
      }
      return res.data;
    },
    onSuccess: data => {
      setActionError(null);
      setActionSuccess(null);
      setRevealedKey({
        id: data.id,
        name: form.getValues("name"),
        apiKey: data.apiKey,
        copied: false,
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
    onError: err => {
      setActionSuccess(null);
      setActionError(err instanceof Error ? err.message : "Failed to create API key. Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await client["api-keys"]({ id }).delete();
      if (res.status !== 200) {
        throw new Error(apiErrorMessage(res.data, "Failed to delete API key. Please try again."));
      }
      return res.data;
    },
    onSuccess: () => {
      setActionError(null);
      setActionSuccess("API key deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
    onError: err => {
      setActionSuccess(null);
      setActionError(err instanceof Error ? err.message : "Failed to delete API key. Please try again.");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, disabled }: { id: string; disabled: boolean }) => {
      const res = await client["api-keys"].put({ id, disabled });
      if (res.status !== 200) {
        throw new Error(apiErrorMessage(res.data, "Failed to update API key. Please try again."));
      }
      return res.data;
    },
    onSuccess: (_data, variables) => {
      setActionError(null);
      setActionSuccess(
        variables.disabled ? "API key disabled." : "API key enabled and ready to use.",
      );
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
    onError: err => {
      setActionSuccess(null);
      setActionError(err instanceof Error ? err.message : "Failed to update API key. Please try again.");
    },
  });

  const keys = keysQuery.data?.ok ? (keysQuery.data.apiKeys ?? []) : [];
  const isBusy = createMutation.isPending || deleteMutation.isPending || toggleMutation.isPending;

  const copyRevealedKey = async () => {
    if (!revealedKey || revealedKey.copied) return;
    try {
      await navigator.clipboard.writeText(revealedKey.apiKey);
      setRevealedKey({ ...revealedKey, copied: true });
      setActionError(null);
      setActionSuccess("API key copied. It is now hidden for security.");
    } catch {
      setActionError("Could not copy to clipboard. Please copy the key manually.");
    }
  };

  const onCreate = (values: CreateKeyFormValues) => {
    setActionError(null);
    setActionSuccess(null);
    createMutation.mutate(values.name);
  };

  const loadError =
    keysQuery.error instanceof Error
      ? keysQuery.error.message
      : keysQuery.isError
        ? "Could not load API keys."
        : null;

  return (
    <DashboardShell
      title="API keys"
      description="Create and manage keys for authenticating requests to the gateway."
    >
      {loadError ? <ErrorBanner message={loadError} /> : null}
      {actionError ? (
        <ErrorBanner message={actionError} onDismiss={() => setActionError(null)} />
      ) : null}
      {actionSuccess ? (
        <SuccessBanner message={actionSuccess} onDismiss={() => setActionSuccess(null)} />
      ) : null}

      {revealedKey ? (
        <Card className="border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-emerald-200">
              {revealedKey.copied ? "API key saved" : "New API key — copy now"}
            </CardTitle>
            <CardDescription>
              {revealedKey.copied
                ? "Only a masked preview is shown below. The full key cannot be viewed again."
                : "Copy this key once. After copying, it will be hidden and cannot be shown again."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              <span className="font-medium text-foreground">{revealedKey.name}</span>
            </p>
            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/80 p-3">
              <code className="min-w-0 flex-1 break-all font-mono text-sm">
                {revealedKey.copied ? maskApiKey(revealedKey.apiKey) : revealedKey.apiKey}
              </code>
              {!revealedKey.copied ? (
                <Button type="button" size="icon" variant="outline" className="shrink-0" onClick={copyRevealedKey}>
                  <Copy className="size-4" />
                </Button>
              ) : (
                <Check className="size-5 shrink-0 text-emerald-400" />
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setRevealedKey(null)}>
              {revealedKey.copied ? "Done" : "I saved my key — dismiss"}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-border/60 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-violet-500/15">
            <Plus className="size-5 text-violet-300" />
          </div>
          <CardTitle>Create API key</CardTitle>
          <CardDescription>Give your key a label so you can tell integrations apart.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onCreate)} className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Key name</FormLabel>
                    <FormControl>
                      <Input placeholder="Production app" autoComplete="off" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="shrink-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 sm:mb-0"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  <>
                    <Plus className="size-4" />
                    Create key
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Your keys</CardTitle>
          <CardDescription>
            {keys.length === 0
              ? "No keys yet. Create one above to start making requests."
              : `${keys.length} key${keys.length === 1 ? "" : "s"} on this account`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-0 sm:p-0">
          {keysQuery.isLoading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
              Loading API keys…
            </div>
          ) : keysQuery.isError ? (
            <p className="px-6 py-16 text-center text-sm text-muted-foreground">
              Could not load your API keys. See the error message above.
            </p>
          ) : keys.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
              <KeyRound className="size-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">Create your first API key to get started.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {keys.map(key => (
                <li key={key.id} className="space-y-4 px-6 py-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{key.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Last used {formatLastUsed(key.lastUsed)}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                        key.disabled
                          ? "bg-muted text-muted-foreground"
                          : "bg-emerald-500/15 text-emerald-300",
                      )}
                    >
                      {key.disabled ? "Disabled" : "Active"}
                    </span>
                  </div>

                  <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
                    <code className="font-mono text-sm text-muted-foreground">{maskApiKey(key.apiKey)}</code>
                    <p className="mt-1 text-xs text-muted-foreground">Full key is hidden for security</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground tabular-nums">
                        {key.creditsConsumed.toLocaleString()}
                      </span>{" "}
                      credits consumed
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={isBusy}
                        onClick={() => {
                          setActionError(null);
                          setActionSuccess(null);
                          toggleMutation.mutate({ id: key.id, disabled: !key.disabled });
                        }}
                      >
                        {toggleMutation.isPending ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Power className="size-3.5" />
                        )}
                        {key.disabled ? "Enable" : "Disable"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        disabled={isBusy}
                        onClick={() => {
                          if (window.confirm(`Delete API key "${key.name}"? This cannot be undone.`)) {
                            setActionError(null);
                            setActionSuccess(null);
                            deleteMutation.mutate(key.id);
                          }
                        }}
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="size-3.5" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
