import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { SignIn } from "@clerk/clerk-react";

export function Signin() {
  return (
    <MarketingLayout className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      {/* hash routing keeps Clerk's multi-step flow on /signin instead of nested paths */}
      <SignIn routing="hash" signUpUrl="/signup" />
    </MarketingLayout>
  );
}
