import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/clerk-react";
import { AlertTriangle } from "lucide-react";

/**
 * Shown when Clerk says you're signed in but the API answers 401. Redirecting
 * to /signin here would loop, because Clerk sends signed-in users straight back.
 */
export function SessionRejectedBanner() {
  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive sm:flex-row sm:items-center"
    >
      <AlertTriangle className="size-4 shrink-0" />
      <span className="flex-1">
        You're signed in, but the server couldn't verify your session. Sign out and back in; if it
        keeps happening, the server's Clerk keys need checking.
      </span>
      <SignOutButton>
        <Button variant="outline" size="sm" className="shrink-0">
          Sign out
        </Button>
      </SignOutButton>
    </div>
  );
}
