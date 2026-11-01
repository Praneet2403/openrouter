import { Elysia } from "elysia";

// TEMP diagnostic: surface which module fails to resolve on Vercel
let server: Elysia | undefined;
let startupError: string | undefined;
try {
  const { app: dashboardApi } = await import("../apps/primary-backend/src/app");
  const { app: gateway } = await import("../apps/api-backend/src/app");
  server = new Elysia().use(gateway).group("/api", app => app.use(dashboardApi)) as unknown as Elysia;
} catch (e: any) {
  startupError = JSON.stringify({ message: e?.message, specifier: e?.specifier, referrer: e?.referrer, code: e?.code });
  console.error("startup failed:", startupError);
}

export default {
  fetch: (req: Request) =>
    server ? server.fetch(req) : new Response(startupError ?? "startup failed", { status: 500 }),
};
