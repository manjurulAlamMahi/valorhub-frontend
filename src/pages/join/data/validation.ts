import type { Stage } from "./onboarding";
import { isValidUrl, type OnboardingValues } from "./onboarding-state";

export type Errors = Partial<Record<keyof OnboardingValues | string, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const required = (value: string) => value.trim().length > 0;

export const socialFields = [
  "website",
  "facebook",
  "instagram",
  "linkedin",
  "twitter",
] as const;

export function validate(stage: Stage, values: OnboardingValues): Errors {
  const errors: Errors = {};

  if (stage === "account") {
    if (!EMAIL.test(values.email.trim()))
      errors.email = "Enter a valid email address.";
    if (values.password.length < 8)
      errors.password = "Password must be at least 8 characters.";
    if (values.passwordConfirmation !== values.password)
      errors.passwordConfirmation = "Passwords don't match.";
    if (!required(values.businessName))
      errors.businessName = "Business name is required.";
    if (!required(values.ownerName))
      errors.ownerName = "Owner name is required.";
    if (values.phone.replace(/\D/g, "").length < 10)
      errors.phone = "Enter a valid phone number.";
    if (!values.businessType)
      errors.businessType = "Choose your business type.";
    if (!values.termsAccepted)
      errors.termsAccepted =
        "You need to accept the Terms of Service and Privacy Policy.";
  }

  if (stage === "business-info") {
    if (!required(values.businessName))
      errors.businessName = "Business name is required.";
    if (!values.category) errors.category = "Choose a business category.";
    if (!required(values.city)) errors.city = "City is required.";
    if (!required(values.state)) errors.state = "State is required.";
    if (!/^\d{5}(-\d{4})?$/.test(values.zip.trim()))
      errors.zip = "Enter a valid ZIP code.";
  }

  if (stage === "profile") {
    const years = values.yearsExperience.trim();
    if (years && !(/^\d+$/.test(years) && Number(years) <= 100))
      errors.yearsExperience = "Enter a number between 0 and 100.";
  }

  if (stage === "social") {
    for (const field of socialFields) {
      if (!isValidUrl(values[field])) errors[field] = "Enter a valid link.";
    }
  }

  if (stage === "services" && values.services.length === 0)
    errors.services = "Select at least one service you offer.";

  return errors;
}
