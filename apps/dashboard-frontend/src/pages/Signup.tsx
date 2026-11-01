import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { SignUp } from "@clerk/clerk-react";

export function Signup() {
  return (
    <MarketingLayout className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      {/* hash routing keeps Clerk's multi-step flow on /signup instead of nested paths */}
      <SignUp routing="hash" signInUrl="/signin" />
    </MarketingLayout>
  );
}
