import { treaty } from "@elysiajs/eden";
import type { App } from "app";
import { createContext, useContext } from "react";

// Locally the API runs on its own port; deployed, it's served from /api on the same origin
const apiUrl =
  window.location.hostname === "localhost" ? "localhost:3000" : `${window.location.origin}/api`;

type ClerkWindow = Window & {
  Clerk?: { session?: { getToken(): Promise<string | null> } | null };
};

export const client = treaty<App>(apiUrl, {
  // Clerk's script exposes the signed-in session on window.Clerk; send its
  // short-lived token with every request so the API can verify who's calling
  headers: async () => {
    const token = await (window as ClerkWindow).Clerk?.session?.getToken();
    return token ? { authorization: `Bearer ${token}` } : undefined;
  },
});

const ElysiaClientContext = createContext(client);

export const ElysiaClientContextProvider = ElysiaClientContext.Provider;
export const useElysiaClient = () => {
  const client = useContext(ElysiaClientContext);
  return client;
};
