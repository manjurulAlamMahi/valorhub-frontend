import { onboarding } from "../data/onboarding";
import type { OnboardingValues, StepProps } from "../data/onboarding-state";
import { ContinueButton, TextField } from "./form-controls";
import StepCard from "./step-card";
import StepForm from "./step-form";

const fields: {
  name: keyof OnboardingValues;
  label: string;
  placeholder: string;
}[] = [
  {
    name: "website",
    label: "Website URL",
    placeholder: "https://yourbusiness.com",
  },
  {
    name: "facebook",
    label: "Facebook",
    placeholder: "facebook.com/yourbusiness",
  },
  {
    name: "instagram",
    label: "Instagram",
    placeholder: "instagram.com/yourbusiness",
  },
  {
    name: "linkedin",
    label: "LinkedIn",
    placeholder: "linkedin.com/company/yourbusiness",
  },
  {
    name: "twitter",
    label: "X (Twitter)",
    placeholder: "x.com/yourbusiness",
  },
];

export default function StepSocialLinks({
  values,
  errors,
  onChange,
  onSubmit,
  onBack,
}: StepProps) {
  return (
    <StepCard
      title={onboarding.social.title}
      description={onboarding.social.description}
      onBack={onBack}
    >
      <StepForm onSubmit={onSubmit}>
        <div className="grid gap-4 pt-4 sm:grid-cols-2 sm:gap-x-3">
          {fields.map((field) => (
            <TextField
              key={field.name}
              id={`social-${field.name}`}
              label={field.label}
              type="url"
              inputMode="url"
              placeholder={field.placeholder}
              value={values[field.name] as string}
              error={errors[field.name]}
              onChange={(event) => onChange(field.name, event.target.value)}
              className="sm:col-span-2"
            />
          ))}
        </div>
        <ContinueButton />
      </StepForm>
    </StepCard>
  );
}
