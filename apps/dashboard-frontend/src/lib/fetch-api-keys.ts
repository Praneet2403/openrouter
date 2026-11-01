import type { client } from "@/providers/Eden";

type Client = typeof client;

export type ApiKeyRecord = {
  id: string;
  apiKey: string;
  name: string;
  creditsConsumed: number;
  lastUsed: Date | string | null;
  disabled: boolean;
};

export type ApiKeysQueryData =
  | { ok: false }
  | { ok: true; apiKeys: ApiKeyRecord[] };

export async function fetchApiKeys(client: Client): Promise<ApiKeysQueryData> {
  const res = await client["api-keys"].get();
  if (res.status === 401) return { ok: false };
  if (res.status !== 200 || !res.data) {
    throw new Error("Could not load your API keys. Please refresh the page.");
  }
  return { ok: true, apiKeys: res.data.apiKeys ?? [] };
}
