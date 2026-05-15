import { Elysia } from "elysia";

import { app as apiKeyApp } from "./modules/apiKeys";
import { app as authApp } from "./modules/auth";
import { app as modelsApp } from "./modules/models";
import { app as paymentsApp } from "./modules/payments";

export const app = new Elysia()
.use(authApp)
.use(apiKeyApp)
.use(modelsApp)
.use(paymentsApp)


export type App = typeof app;


/*
  auth sign-in sign-up
  api-key -> create , get , delete, disable
  model -> get all supported models, their pricing , providers, etc.
  payment -> razorpay/stripe
*/