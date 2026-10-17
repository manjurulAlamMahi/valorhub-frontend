import { CircleCheck, LoaderCircle, Shield } from "lucide-react";
import { useState } from "react";
import { onboarding } from "../data/onboarding";
import { ContinueButton } from "./form-controls";
import StepCard from "./step-card";
import StepForm from "./step-form";

const copy = onboarding.verification;

type StepVerificationProps = {
  verified: boolean;
  onVerified: () => void;
  onFailed: () => void;
  onSubmit: () => void;
  onBack: () => void;
};

export default function StepVerification({
  verified,
  onVerified,
  onFailed,
  onSubmit,
  onBack,
}: StepVerificationProps) {
  const [verifying, setVerifying] = useState(false);

  // Placeholder for the ID.me OAuth hand-off; `?idme=fail` previews the failure screen
  const verify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      if (new URLSearchParams(window.location.search).get("idme") === "fail")
        onFailed();
      else onVerified();
    }, 1200);
  };

  return (
    <StepCard title={copy.title} description={copy.description} onBack={onBack}>
      <div className="flex flex-col items-center text-center">
        <span className="grid size-20 place-content-center rounded-full bg-[#26225f]/8">
          <Shield aria-hidden className="text-secondary-foreground size-9" />
        </span>
        <h2 className="pt-6 font-mono text-lg leading-7 font-bold text-[#1a1830]">
          {copy.heading}
        </h2>
        <p className="pt-2 text-sm leading-[22.75px] text-[#6b6e8a]">
          {copy.body}
        </p>
      </div>

      <div className="py-6">
        {verified ? (
          <p
            role="status"
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#def5e3] text-[15px] font-semibold text-[#0f6633]"
          >
            <CircleCheck aria-hidden className="size-5" />
            {copy.verified}
          </p>
        ) : (
          <button
            type="button"
            onClick={verify}
            disabled={verifying}
            aria-busy={verifying}
            className="flex h-12 w-full items-center justify-center gap-1.5 rounded-xl bg-[#262262] text-[15.4px] font-bold text-white hover:bg-[#1c1a4a] disabled:opacity-80"
          >
            {verifying ? (
              <LoaderCircle aria-hidden className="size-5 animate-spin" />
            ) : (
              <Shield aria-hidden className="size-5" />
            )}
            {copy.cta}
          </button>
        )}
      </div>

      <StepForm onSubmit={onSubmit}>
        {!verified && (
          <p className="text-center text-sm leading-5 font-semibold text-[#6b6e8a]">
            {copy.required}
          </p>
        )}
        <ContinueButton disabled={!verified}>{copy.continue}</ContinueButton>
      </StepForm>
    </StepCard>
  );
}
