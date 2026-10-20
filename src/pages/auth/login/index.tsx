import { useAuth } from "@/hooks/use-auth";
import { ApiError, firstFieldErrors } from "@/lib/api";
import {
  ContinueButton,
  TextField,
} from "@/pages/join/_components/form-controls";
import StepForm from "@/pages/join/_components/step-form";
import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import AuthCard, { AuthLink } from "../_components/auth-card";

type Errors = Partial<Record<"email" | "password", string>>;

export default function Login() {
  const { login } = useAuth();
  const [params] = useSearchParams();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Carry the post-login destination across the login/register screens
  const redirect = params.get("redirect");
  const withRedirect = (path: string) =>
    redirect ? `${path}?redirect=${encodeURIComponent(redirect)}` : path;

  const submit = async () => {
    const nextErrors: Errors = {};
    if (!email.trim()) nextErrors.email = "Enter your email address.";
    if (!password) nextErrors.password = "Enter your password.";
    setErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      // GuestOnly redirects once the session is set
      await login({ email: email.trim(), password });
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.fieldErrors).length) {
        setErrors(firstFieldErrors(error));
      } else {
        setFormError(
          error instanceof ApiError
            ? error.message
            : "Something went wrong. Please try again.",
        );
      }
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      description="Log in to manage your requests, quotes and projects."
      error={formError}
      footer={
        <>
          <p>
            New to ValorHub?{" "}
            <AuthLink to={withRedirect("/register")}>
              Create an account
            </AuthLink>
          </p>
          <p>
            Veteran-owned business?{" "}
            <AuthLink to="/join">Join as a Pro</AuthLink>
          </p>
        </>
      }
    >
      <StepForm onSubmit={submit}>
        <TextField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          error={errors.email}
          onChange={(event) => {
            setEmail(event.target.value);
            setErrors((prev) => ({ ...prev, email: undefined }));
          }}
        />
        <div className="space-y-2">
          <TextField
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            error={errors.password}
            onChange={(event) => {
              setPassword(event.target.value);
              setErrors((prev) => ({ ...prev, password: undefined }));
            }}
          />
          <Link
            to="/forgot-password"
            className="text-secondary-foreground block text-right text-sm leading-5 font-semibold hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <ContinueButton disabled={submitting}>
          {submitting ? "Logging in…" : "Log In"}
        </ContinueButton>
      </StepForm>
    </AuthCard>
  );
}
