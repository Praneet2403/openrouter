import { createClerkClient, verifyToken } from "@clerk/backend";
import Elysia from "elysia";
import { AuthService } from "./service";

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
    } catch {
      return status(401);
    }

    const userId = await AuthService.findOrCreateClerkUser(clerkUserId, async () => {
      const user = await getClerk().users.getUser(clerkUserId);
      return user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress;
    });

    return {
      userId: userId.toString(),
    };
  });
