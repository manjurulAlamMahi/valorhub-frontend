import { useAuth } from "@/hooks/use-auth";
import { ApiError, firstFieldErrors } from "@/lib/api";
import {
  ContinueButton,
  TextField,
} from "@/pages/join/_components/form-controls";
import StepForm from "@/pages/join/_components/step-form";
import { useState } from "react";
import { useSearchParams } from "react-router";
import AuthCard, { AuthLink } from "../_components/auth-card";

const initialValues = {
  name: "",
  email: "",
  phone: "",
  password: "",
  password_confirmation: "",
};

type Values = typeof initialValues;
type Errors = Partial<Record<keyof Values, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Enter your full name.";
  if (!EMAIL_PATTERN.test(values.email.trim()))
    errors.email = "Enter a valid email address.";
  if (values.password.length < 8)
    errors.password = "Password must be at least 8 characters.";
  if (values.password_confirmation !== values.password)
    errors.password_confirmation = "Passwords don't match.";
  return errors;
}

// Customer sign up; contractors sign up through /join
export default function Register() {
  const { register } = useAuth();
  const [params] = useSearchParams();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirect = params.get("redirect");
  const loginPath = redirect
    ? `/login?redirect=${encodeURIComponent(redirect)}`
    : "/login";

  const update = (field: keyof Values, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const submit = async () => {
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length) {
      document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    setSubmitting(true);
    try {
      // GuestOnly redirects once the session is set
      await register({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim() || null,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });
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

  const field = (name: keyof Values) => ({
    id: name.replace("_", "-"),
    value: values[name],
    error: errors[name],
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      update(name, event.target.value),
  });

  return (
    <AuthCard
      title="Create your account"
      description="Request quotes from verified veteran-owned businesses."
      error={formError}
      footer={
        <>
          <p>
            Already have an account? <AuthLink to={loginPath}>Log in</AuthLink>
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
          label="Full Name"
          autoComplete="name"
          placeholder="Sarah Johnson"
          {...field("name")}
        />
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...field("email")}
        />
        <TextField
          label="Phone Number (optional)"
          type="tel"
          autoComplete="tel"
          placeholder="(555) 000-0000"
          {...field("phone")}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          {...field("password")}
        />
        <TextField
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter password"
          {...field("password_confirmation")}
        />
        <ContinueButton disabled={submitting}>
          {submitting ? "Creating account…" : "Create Account"}
        </ContinueButton>
      </StepForm>
    </AuthCard>
  );
}
