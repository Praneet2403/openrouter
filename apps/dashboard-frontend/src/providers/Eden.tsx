import { treaty } from "@elysiajs/eden";
import type { App } from "app";
import { createContext, useContext } from "react";

// Locally the API runs on its own port; deployed, it's served from /api on the same origin
const apiUrl =
  window.location.hostname === "localhost" ? "localhost:3000" : `${window.location.origin}/api`;

export const client = treaty<App>(apiUrl, {
  fetch: {
    credentials: "include",
  },
});

const ElysiaClientContext = createContext(client);

export const ElysiaClientContextProvider = ElysiaClientContext.Provider;
export const useElysiaClient = () => {
  const client = useContext(ElysiaClientContext);
  return client;
};
