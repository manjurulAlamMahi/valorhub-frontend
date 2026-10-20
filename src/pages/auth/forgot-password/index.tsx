import { ApiError, firstFieldErrors } from "@/lib/api";
import {
  ContinueButton,
  TextField,
} from "@/pages/join/_components/form-controls";
import StepForm from "@/pages/join/_components/step-form";
import { authApi } from "@/services/auth";
import { useState } from "react";
import AuthCard, { AuthLink } from "../_components/auth-card";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [sentMessage, setSentMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setFormError("");
    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await authApi.forgotPassword(email.trim());
      setSentMessage(response.message);
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors.email) {
        setError(firstFieldErrors(err).email);
      } else {
        setFormError(
          err instanceof ApiError
            ? err.message
            : "Something went wrong. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title={sentMessage ? "Check your email" : "Forgot your password?"}
      description={
        sentMessage
          ? undefined
          : "Enter your email and we'll send you a link to reset it."
      }
      error={formError}
      footer={
        <p>
          Remembered it? <AuthLink to="/login">Back to log in</AuthLink>
        </p>
      }
    >
      {sentMessage ? (
        <p className="text-sm leading-5 text-[#4a5565]">{sentMessage}</p>
      ) : (
        <StepForm onSubmit={submit}>
          <TextField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            error={error}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
          />
          <ContinueButton disabled={submitting}>
            {submitting ? "Sending…" : "Send Reset Link"}
          </ContinueButton>
        </StepForm>
      )}
    </AuthCard>
  );
}
