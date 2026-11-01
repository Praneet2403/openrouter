import { Elysia } from "elysia";
import { app as dashboardApi } from "../apps/primary-backend/src/app";
import { app as gateway } from "../apps/api-backend/src/app";

// One Vercel Function serves both backends on the site's own origin, so the
// auth cookie stays first-party. The gateway already owns /api/v1/*.
const server = new Elysia()
  .use(gateway)
  .group("/api", app => app.use(dashboardApi));

export default { fetch: server.fetch };
