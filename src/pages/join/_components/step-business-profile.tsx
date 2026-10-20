import { ImageIcon } from "lucide-react";
import { useState } from "react";
import { onboarding } from "../data/onboarding";
import type { StepProps } from "../data/onboarding-state";
import {
  ContinueButton,
  TextAreaField,
  TextField,
  ToggleCard,
  UploadBox,
} from "./form-controls";
import StepCard from "./step-card";
import StepForm from "./step-form";

export default function StepBusinessProfile({
  values,
  errors,
  onChange,
  onSubmit,
  onBack,
  free,
}: StepProps & { free: boolean }) {
  const [uploadErrors, setUploadErrors] = useState({
    documents: "",
    cover: "",
  });
  const icon = (
    <ImageIcon aria-hidden className="text-secondary-foreground/60 size-5.5" />
  );

  return (
    <StepCard
      title={onboarding.profile.title}
      description={onboarding.profile.description}
      onBack={onBack}
    >
      <StepForm onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-3">
          <TextField
            id="years"
            label="Years of Experience"
            inputMode="numeric"
            placeholder="e.g. 12"
            value={values.yearsExperience}
            error={errors.yearsExperience}
            onChange={(event) =>
              onChange("yearsExperience", event.target.value)
            }
          />
          <TextField
            id="license"
            label="License Number"
            placeholder="LIC-0001234"
            value={values.licenseNumber}
            onChange={(event) => onChange("licenseNumber", event.target.value)}
          />
          <TextField
            id="insurance"
            label="Insurance Company"
            placeholder="State Farm"
            value={values.insuranceCompany}
            onChange={(event) =>
              onChange("insuranceCompany", event.target.value)
            }
          />
          <TextField
            id="policy"
            label="Policy Number"
            placeholder="POL-9876543"
            value={values.policyNumber}
            onChange={(event) => onChange("policyNumber", event.target.value)}
          />
          <ToggleCard
            label="Emergency Service"
            checked={values.emergencyService}
            onChange={(checked) => onChange("emergencyService", checked)}
          />
          <ToggleCard
            label="Available Today"
            checked={values.availableToday}
            onChange={(checked) => onChange("availableToday", checked)}
          />
        </div>
        <TextField
          id="languages"
          label="Languages"
          placeholder="English, Spanish, ..."
          value={values.languages}
          onChange={(event) => onChange("languages", event.target.value)}
        />
        <TextAreaField
          id="about"
          label="About Your Company"
          placeholder="Share your story, military service, certifications and why clients choose you..."
          value={values.about}
          onChange={(event) => onChange("about", event.target.value)}
        />
        {/* License uploads are a paid-plan feature; the API stores one document */}
        {!free && (
          <UploadBox
            id="documents"
            accept="application/pdf,image/png,image/jpeg"
            maxSize={10}
            files={values.documents}
            onChange={(files) => onChange("documents", files)}
            error={uploadErrors.documents}
            onError={(error) =>
              setUploadErrors((prev) => ({ ...prev, documents: error }))
            }
            icon={icon}
            title="Upload License Document"
            hint="PDF, PNG, or JPG up to 10MB"
          />
        )}
        <UploadBox
          id="cover"
          accept="image/png,image/jpeg"
          maxSize={5}
          files={values.coverPhoto}
          onChange={(files) => onChange("coverPhoto", files)}
          error={uploadErrors.cover}
          onError={(error) =>
            setUploadErrors((prev) => ({ ...prev, cover: error }))
          }
          icon={icon}
          title="Upload Cover Photo"
          hint="PNG or JPG up to 5MB · Recommended: 1400 × 400px"
        />
        <ContinueButton />
      </StepForm>
    </StepCard>
  );
}
