import Elysia from "elysia";
import { PaymentsModel } from "./models";
import { PaymentsService } from "./service";
import { clerkAuth } from "../auth/clerk";

export const app = new Elysia({ prefix: "payments" })
  .use(clerkAuth)
  .post(
    "/onramp",
    async ({ userId, status }) => {
      try {
        const { credits } = await PaymentsService.onrampCredits(Number(userId));
        return {
          credits,
          message: "Credited successfully" as const,
        };
      } catch {
        return status(400, {
          message: "Onramp failed" as const,
        });
      }
    },
    {
      response: {
        200: PaymentsModel.onrampResponseSchema,
        400: PaymentsModel.onrampFailedSchema,
      },
    },
  );
