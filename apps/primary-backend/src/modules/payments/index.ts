import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { PaymentsModel } from "./models";
import { PaymentsService } from "./service";

export const app = new Elysia({ prefix: "payments" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
    }),
  )
  .resolve(async ({ cookie: { auth }, status, jwt }) => {
    if (!auth) {
      return status(401);
    }
    const decoded = await jwt.verify(auth.value as string);
    if (!decoded || !decoded.userId) {
      return status(401);
    }

    return {
      userId: decoded.userId as string,
    };
  })
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
