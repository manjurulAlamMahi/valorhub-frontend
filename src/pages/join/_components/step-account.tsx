import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Link } from "react-router";
import { businessTypes, onboarding } from "../data/onboarding";
import type { StepProps } from "../data/onboarding-state";
import {
  ContinueButton,
  FieldError,
  OptionGroup,
  TextField,
} from "./form-controls";
import StepCard from "./step-card";
import StepForm from "./step-form";

export default function StepAccount({
  values,
  errors,
  onChange,
  onSubmit,
}: StepProps) {
  return (
    <StepCard
      title={onboarding.account.title}
      description={onboarding.account.description}
    >
      <StepForm onSubmit={onSubmit}>
        <TextField
          id="email"
          label="Business Email"
          type="email"
          autoComplete="email"
          placeholder="owner@yourbusiness.com"
          value={values.email}
          error={errors.email}
          onChange={(event) => onChange("email", event.target.value)}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          value={values.password}
          error={errors.password}
          onChange={(event) => onChange("password", event.target.value)}
        />
        <TextField
          id="password-confirmation"
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter password"
          value={values.passwordConfirmation}
          error={errors.passwordConfirmation}
          onChange={(event) =>
            onChange("passwordConfirmation", event.target.value)
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-3">
          <TextField
            id="business-name"
            label="Business Name"
            autoComplete="organization"
            placeholder="Eagle Roofing LLC"
            value={values.businessName}
            error={errors.businessName}
            onChange={(event) => onChange("businessName", event.target.value)}
          />
          <TextField
            id="owner-name"
            label="Owner Name"
            autoComplete="name"
            placeholder="John Smith"
            value={values.ownerName}
            error={errors.ownerName}
            onChange={(event) => onChange("ownerName", event.target.value)}
          />
        </div>
        <TextField
          id="phone"
          label="Phone Number"
          type="tel"
          autoComplete="tel"
          placeholder="(555) 000-0000"
          value={values.phone}
          error={errors.phone}
          onChange={(event) => onChange("phone", event.target.value)}
        />
        <OptionGroup
          id="business-type"
          label="Business Type"
          options={businessTypes}
          value={values.businessType}
          error={errors.businessType}
          onChange={(value) => onChange("businessType", value)}
          className="grid-cols-2"
        />

        <div className="space-y-1.5">
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-[#6b6e8a]">
            <input
              type="checkbox"
              checked={values.termsAccepted}
              onChange={(event) =>
                onChange("termsAccepted", event.target.checked)
              }
              aria-invalid={Boolean(errors.termsAccepted)}
              aria-describedby={
                errors.termsAccepted ? "terms-error" : undefined
              }
              className="peer sr-only"
            />
            <span
              aria-hidden
              className={cn(
                "mt-0.5 grid size-5 shrink-0 place-content-center rounded-full border-2 border-[#d1d5dc] text-white peer-focus-visible:ring-3 peer-focus-visible:ring-[#26225f]/20",
                {
                  "border-secondary-foreground bg-secondary-foreground":
                    values.termsAccepted,
                  "border-[#c92032]": errors.termsAccepted,
                },
              )}
            >
              {values.termsAccepted && (
                <Check className="size-3" strokeWidth={3} />
              )}
            </span>
            <span>
              I agree to ValorHub's{" "}
              <Link
                to="/faq"
                className="text-secondary-foreground font-semibold hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/faq"
                className="text-secondary-foreground font-semibold hover:underline"
              >
                Privacy Policy
              </Link>
            </span>
          </label>
          <FieldError id="terms" error={errors.termsAccepted} />
        </div>

        <ContinueButton />
      </StepForm>
    </StepCard>
  );
}
