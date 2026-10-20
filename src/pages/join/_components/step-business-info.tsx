import { Camera } from "lucide-react";
import { useState } from "react";
import { onboarding } from "../data/onboarding";
import type { StepProps } from "../data/onboarding-state";
import {
  ContinueButton,
  OptionGroup,
  TextAreaField,
  TextField,
  UploadBox,
} from "./form-controls";
import StepCard from "./step-card";
import StepForm from "./step-form";

export default function StepBusinessInfo({
  values,
  errors,
  onChange,
  onSubmit,
  onBack,
  categories,
}: StepProps & { categories: { id: number; name: string }[] }) {
  const [uploadError, setUploadError] = useState("");
  // The radio group works with labels; the form stores the backend category id
  const selected = categories.find(
    (category) => String(category.id) === values.category,
  );

  return (
    <StepCard
      title={onboarding.businessInfo.title}
      description={onboarding.businessInfo.description}
      onBack={onBack}
    >
      <StepForm onSubmit={onSubmit}>
        <UploadBox
          id="logo"
          accept="image/png,image/jpeg"
          maxSize={5}
          files={values.logo}
          onChange={(files) => onChange("logo", files)}
          error={uploadError}
          onError={setUploadError}
          className="bg-[#26225f]/2 py-8.5"
          icon={
            <span className="grid size-16 place-content-center rounded-full bg-[#26225f]/10">
              <Camera
                aria-hidden
                className="text-secondary-foreground size-6"
              />
            </span>
          }
          title="Upload Business Logo"
          hint="PNG, JPG up to 5MB"
        >
          <span className="text-secondary-foreground pt-1 text-sm leading-5 font-semibold">
            Business Logo Requirements
          </span>
          <span className="max-w-118 text-sm leading-5 text-[#6b6e8a]">
            • PNG (transparent) or JPG • White background preferred
            <br />• Recommended size: 1000 × 1000 px • Maximum file size: 5 MB
          </span>
        </UploadBox>

        <TextField
          id="info-business-name"
          label="Business Name"
          autoComplete="organization"
          placeholder="Eagle Roofing LLC"
          value={values.businessName}
          error={errors.businessName}
          onChange={(event) => onChange("businessName", event.target.value)}
        />
        <TextAreaField
          id="description"
          label="Business Description"
          placeholder="Describe your business, expertise, and what makes you unique..."
          value={values.description}
          error={errors.description}
          onChange={(event) => onChange("description", event.target.value)}
        />
        <OptionGroup
          id="category"
          label="Business Category"
          size="sm"
          options={categories.map((category) => category.name)}
          value={selected?.name ?? ""}
          error={errors.category}
          onChange={(name) =>
            onChange(
              "category",
              String(categories.find((item) => item.name === name)?.id ?? ""),
            )
          }
          className="grid-cols-2 sm:grid-cols-3"
        />
        <TextField
          id="street"
          label="Street Address"
          autoComplete="street-address"
          placeholder="123 Main St"
          value={values.street}
          onChange={(event) => onChange("street", event.target.value)}
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <TextField
            id="city"
            label="City"
            autoComplete="address-level2"
            placeholder="Arlington"
            value={values.city}
            error={errors.city}
            onChange={(event) => onChange("city", event.target.value)}
            className="max-sm:col-span-2"
          />
          <TextField
            id="state"
            label="State"
            autoComplete="address-level1"
            placeholder="VA"
            value={values.state}
            error={errors.state}
            onChange={(event) => onChange("state", event.target.value)}
          />
          <TextField
            id="zip"
            label="ZIP"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="22201"
            value={values.zip}
            error={errors.zip}
            onChange={(event) => onChange("zip", event.target.value)}
          />
        </div>
        <ContinueButton className="mt-6" />
      </StepForm>
    </StepCard>
  );
}
