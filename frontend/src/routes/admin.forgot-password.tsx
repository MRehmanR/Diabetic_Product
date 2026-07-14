import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertCircle, Heart, Mail } from "lucide-react";
import { toast } from "sonner";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminApi } from "@/lib/admin-api";

export const Route = createFileRoute("/admin/forgot-password")({
  head: () => ({
    meta: [{ title: "Forgot Password - Diabetics King" }],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setResetUrl(null);

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    const result = await adminApi.auth.forgotPassword(email.trim());
    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      toast.error("Reset request failed", { description: result.error.message });
      return;
    }

    setMessage(result.data?.message ?? "If that email exists, a password reset link has been sent.");
    setResetUrl(result.data?.reset_url ?? null);
    toast.success("Reset link requested");
  }

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Heart className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Reset Admin Password</h1>
            <p className="mt-1 text-sm text-muted-foreground">Enter your admin email to receive a reset link</p>
          </div>

          <Card className="border-border/50">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-lg">Forgot Password</CardTitle>
              <CardDescription>We will email a secure password reset link if the account exists</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}
                {message && (
                  <div className="rounded-lg bg-primary/10 p-3 text-sm text-primary">
                    <div>{message}</div>
                    {resetUrl && (
                      <a className="mt-2 block break-all font-medium underline" href={resetUrl}>
                        Open development reset link
                      </a>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-9"
                      placeholder="admin@diabcare.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>

              <div className="mt-4 flex justify-center">
                <Link to="/admin/login" className="text-xs text-muted-foreground transition-colors hover:text-primary">
                  Back to admin login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
