import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import { Navigate, useNavigate } from "react-router";

// Inlined at build time from BUN_PUBLIC_CLERK_PUBLISHABLE_KEY
const publishableKey = process.env.BUN_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Matches the site's navy/violet theme and Geist type
const appearance = {
  variables: {
    colorPrimary: "#0e1033",
    colorText: "#0b0d26",
    colorTextSecondary: "#696c84",
    colorBackground: "#ffffff",
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif",
    borderRadius: "0.75rem",
  },
  elements: {
    cardBox: "rounded-2xl shadow-[0_2px_4px_rgba(11,13,38,0.03),0_30px_60px_-30px_rgba(11,13,38,0.25)]",
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  if (!publishableKey) {
    throw new Error("BUN_PUBLIC_CLERK_PUBLISHABLE_KEY is not set");
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      routerPush={to => navigate(to)}
      routerReplace={to => navigate(to, { replace: true })}
      signInUrl="/signin"
      signUpUrl="/signup"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      afterSignOutUrl="/"
      appearance={appearance}
    >
      {children}
    </ClerkProvider>
  );
}

/** Renders its children only for signed-in users; everyone else goes to /signin. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!isSignedIn) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}
