import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ErrorBanner } from "@/components/ui/alert-banner";
import { apiErrorMessage } from "@/lib/api-error";
import { useElysiaClient } from "@/providers/Eden";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { z } from "zod";

const signinSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SigninFormValues = z.infer<typeof signinSchema>;

export function Signin() {
  const client = useElysiaClient();
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = (location.state as { email?: string } | null | undefined)?.email ?? "";

  const form = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: emailFromState,
      password: "",
    },
  });

  const signinMutation = useMutation({
    mutationFn: async (values: SigninFormValues) => {
      const response = await client.auth["sign-in"].post(values);
      return response;
    },
    onSuccess: response => {
      if (response.status === 200) {
        navigate("/dashboard", { replace: true });
        return;
      }
      if (response.status === 403 && response.data) {
        form.setError("root", {
          message: apiErrorMessage(response.data, "Invalid email or password."),
        });
        return;
      }
      if (response.data) {
        form.setError("root", {
          message: apiErrorMessage(response.data, "Sign in failed. Try again."),
        });
      }
    },
    onError: () => {
      form.setError("root", { message: "Could not reach the server. Is the API running?" });
    },
  });

  const onSubmit = (values: SigninFormValues) => {
    form.clearErrors("root");
    signinMutation.mutate(values);
  };

  return (
    <MarketingLayout className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <Card className="w-full max-w-md border-border/60 bg-card/60 shadow-xl shadow-violet-500/5 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">Welcome back</CardTitle>
          <CardDescription>Sign in to manage API keys, credits, and models.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@company.com" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Your password"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.formState.errors.root?.message ? (
                <ErrorBanner message={form.formState.errors.root.message} />
              ) : null}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500"
                disabled={signinMutation.isPending}
              >
                {signinMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Need an account?{" "}
            <Link to="/signup" className="font-medium text-violet-400 hover:text-violet-300 hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </MarketingLayout>
  );
}
