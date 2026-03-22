import { Elysia } from "elysia";

import {app as authApp} from "./modules/auth"
import {app as apiKeyApp} from "./modules/apiKeys"

const app = new Elysia()
.use(authApp)
.use(apiKeyApp)
.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);


/*
  auth sign-in sign-up
  api-key -> create , get , delete, disable
  model -> get all supported models, their pricing , providers, etc.
  payment -> razorpay/stripe
*/