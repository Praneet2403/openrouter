import { createClerkClient, verifyToken } from "@clerk/backend";
import Elysia from "elysia";
import { AuthService, MissingEmailError } from "./service";

let clerk: ReturnType<typeof createClerkClient> | undefined;
const getClerk = () => clerk ??= createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

//verifies the Clerk session token sent as `Authorization: Bearer <token>`
//and resolves it to our own user id, so route handlers keep using `userId`
export const clerkAuth = new Elysia({ name: "clerk-auth" })
  .resolve({ as: "scoped" }, async ({ headers, status }) => {
    const token = headers.authorization?.replace(/^Bearer\s+/i, "");
    if (!token) {
      return status(401);
    }

    let clerkUserId: string;
    try {
      ({ sub: clerkUserId } = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      }));
    } catch (err) {
      //the reason (expired, bad signature, key from another Clerk app) never
      //includes the token itself, and a silent 401 is impossible to debug
      console.warn(`Clerk session token rejected: ${err instanceof Error ? err.message : err}`);
      return status(401);
    }

    let userId: number;
    try {
      userId = await AuthService.findOrCreateClerkUser(clerkUserId, async () => {
        const user = await getClerk().users.getUser(clerkUserId);
        return user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress;
      });
    } catch (err) {
      if (err instanceof MissingEmailError) {
        return status(403, { message: "Add an email address to your account to use OpenRouter" });
      }
      throw err;
    }

    return {
      userId: userId.toString(),
    };
  });
