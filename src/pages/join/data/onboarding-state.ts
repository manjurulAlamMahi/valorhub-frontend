import type { Plan, Stage } from "./onboarding";

export type OnboardingValues = {
  // Account
  email: string;
  password: string;
  passwordConfirmation: string;
  businessName: string;
  ownerName: string;
  phone: string;
  businessType: string;
  termsAccepted: boolean;
  // Business info
  logo: File[];
  description: string;
  // Backend category id (as a string, for the radio group)
  category: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  // Business profile
  yearsExperience: string;
  licenseNumber: string;
  insuranceCompany: string;
  policyNumber: string;
  emergencyService: boolean;
  availableToday: boolean;
  languages: string;
  about: string;
  documents: File[];
  coverPhoto: File[];
  // Social links
  website: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  // Services
  services: string[];
};

export const initialValues: OnboardingValues = {
  email: "",
  password: "",
  passwordConfirmation: "",
  businessName: "",
  ownerName: "",
  phone: "",
  businessType: "",
  termsAccepted: false,
  logo: [],
  description: "",
  category: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  yearsExperience: "",
  licenseNumber: "",
  insuranceCompany: "",
  policyNumber: "",
  emergencyService: false,
  availableToday: false,
  languages: "",
  about: "",
  documents: [],
  coverPhoto: [],
  website: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  twitter: "",
  services: [],
};

// Until a plan is picked the full 7-step flow is shown
export const isFreePlan = (plan: Plan | null) =>
  plan !== null && plan.monthlyPrice === 0;

// Ordered stages for the chosen plan; checkout and social links are paid-only
export function stagesFor(plan: Plan | null): Stage[] {
  const free = isFreePlan(plan);
  return [
    "account",
    "membership",
    ...(free ? [] : (["checkout"] as Stage[])),
    "verification",
    "business-info",
    "profile",
    ...(free ? [] : (["social"] as Stage[])),
    "services",
    "review",
    "done",
  ];
}

// Accepts "facebook.com/x" as well as full URLs, since Laravel's `url` rule needs a scheme
export function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function isValidUrl(value: string) {
  const url = normalizeUrl(value);
  if (!url) return true;
  try {
    return Boolean(new URL(url).hostname.includes("."));
  } catch {
    return false;
  }
}

export type StepProps = {
  values: OnboardingValues;
  errors: Partial<Record<string, string>>;
  onChange: <K extends keyof OnboardingValues>(
    field: K,
    value: OnboardingValues[K],
  ) => void;
  onSubmit: () => void;
  onBack?: () => void;
};
