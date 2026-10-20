import { ApiError, firstFieldErrors } from "@/lib/api";
import {
  ContinueButton,
  TextField,
} from "@/pages/join/_components/form-controls";
import StepForm from "@/pages/join/_components/step-form";
import { authApi } from "@/services/auth";
import { useState } from "react";
import { useSearchParams } from "react-router";
import AuthCard, { AuthLink } from "../_components/auth-card";

type Errors = Partial<Record<"password" | "password_confirmation", string>>;

// Landing page for the emailed link: /reset-password?token=…&email=…
export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const email = params.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    const nextErrors: Errors = {};
    if (password.length < 8)
      nextErrors.password = "Password must be at least 8 characters.";
    if (confirmation !== password)
      nextErrors.password_confirmation = "Passwords don't match.";
    setErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      await authApi.resetPassword({
        token,
        email,
        password,
        password_confirmation: confirmation,
      });
      setDone(true);
    } catch (error) {
      const fieldErrors =
        error instanceof ApiError ? firstFieldErrors(error) : {};
      if (fieldErrors.password || fieldErrors.password_confirmation) {
        setErrors(fieldErrors);
      } else {
        // An invalid or expired token comes back as a plain message
        setFormError(
          error instanceof ApiError
            ? (fieldErrors.token ?? fieldErrors.email ?? error.message)
            : "Something went wrong. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!token || !email) {
    return (
      <AuthCard
        title="Invalid reset link"
        description="This link is incomplete. Request a new one to reset your password."
        footer={
          <p>
            <AuthLink to="/forgot-password">Request a new link</AuthLink>
          </p>
        }
      />
    );
  }

  if (done) {
    return (
      <AuthCard
        title="Password updated"
        description="Your password has been reset. You can now log in."
        footer={
          <p>
            <AuthLink to={`/login?email=${encodeURIComponent(email)}`}>
              Go to log in
            </AuthLink>
          </p>
        }
      />
    );
  }

  return (
    <AuthCard
      title="Set a new password"
      description={`For ${email}`}
      error={formError}
      footer={
        <p>
          Link expired?{" "}
          <AuthLink to="/forgot-password">Request a new one</AuthLink>
        </p>
      }
    >
      <StepForm onSubmit={submit}>
        <TextField
          id="password"
          label="New Password"
          type="password"
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          value={password}
          error={errors.password}
          onChange={(event) => {
            setPassword(event.target.value);
            setErrors((prev) => ({ ...prev, password: undefined }));
          }}
        />
        <TextField
          id="password-confirmation"
          label="Confirm New Password"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter password"
          value={confirmation}
          error={errors.password_confirmation}
          onChange={(event) => {
            setConfirmation(event.target.value);
            setErrors((prev) => ({
              ...prev,
              password_confirmation: undefined,
            }));
          }}
        />
        <ContinueButton disabled={submitting}>
          {submitting ? "Saving…" : "Reset Password"}
        </ContinueButton>
      </StepForm>
    </AuthCard>
  );
}
