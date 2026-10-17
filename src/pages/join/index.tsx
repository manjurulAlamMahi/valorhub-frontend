import { SEO } from "@/components/seo/SEO";
import { useState } from "react";
import AccountCreated from "./_components/account-created";
import Checkout from "./_components/checkout";
import Membership from "./_components/membership";
import StepAccount from "./_components/step-account";
import StepBusinessInfo from "./_components/step-business-info";
import StepBusinessProfile from "./_components/step-business-profile";
import StepIndicator from "./_components/step-indicator";
import StepReview from "./_components/step-review";
import StepServices from "./_components/step-services";
import StepSocialLinks from "./_components/step-social-links";
import StepVerification from "./_components/step-verification";
import VerificationFailed from "./_components/verification-failed";
import { onboarding, plans, type Plan, type Stage } from "./data/onboarding";
import {
  initialValues,
  isFreePlan,
  stagesFor,
  type OnboardingValues,
  type StepProps,
} from "./data/onboarding-state";
import { validate, type Errors } from "./data/validation";

export default function Join() {
  const [stage, setStage] = useState<Stage>("account");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [verified, setVerified] = useState(false);
  const [accountNumber] = useState(
    () =>
      `VH-CT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
  );

  const stages = stagesFor(plan);
  // Membership and checkout sit outside the numbered steps
  const numbered = stages.filter((item) => onboarding.steps[item]);
  const stepIndex = numbered.indexOf(stage);

  const goTo = (next: Stage) => {
    setStage(next);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const offset = (delta: number) => goTo(stages[stages.indexOf(stage) + delta]);

  const next = () => {
    const stepErrors = validate(stage, values);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    offset(1);
  };

  const update = <K extends keyof OnboardingValues>(
    field: K,
    value: OnboardingValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const stepProps: StepProps = {
    values,
    errors,
    onChange: update,
    onSubmit: next,
    onBack: () => offset(-1),
  };

  const content: Partial<Record<Stage, React.ReactNode>> = {
    account: <StepAccount {...stepProps} onBack={undefined} />,
    verification: (
      <StepVerification
        verified={verified}
        onVerified={() => setVerified(true)}
        onFailed={() => goTo("verification-failed")}
        onSubmit={next}
        onBack={() => offset(-1)}
      />
    ),
    "business-info": <StepBusinessInfo {...stepProps} />,
    profile: <StepBusinessProfile {...stepProps} free={isFreePlan(plan)} />,
    social: <StepSocialLinks {...stepProps} />,
    services: <StepServices {...stepProps} plan={plan ?? plans[0]} />,
    review: (
      <StepReview
        values={values}
        verified={verified}
        onSubmit={next}
        onBack={() => offset(-1)}
      />
    ),
    done: <AccountCreated accountNumber={accountNumber} />,
  };

  return (
    <>
      <SEO
        title={onboarding.seo.title}
        description={onboarding.seo.description}
        canonical="https://valorhub.com/join"
        robots="noindex, follow"
      />

      <main className="bg-input">
        {stage === "membership" ? (
          <Membership
            onSelect={(selected) => {
              setPlan(selected);
              // Keep the saved services within the new plan's limit
              if (selected.serviceLimit !== null)
                update(
                  "services",
                  values.services.slice(0, selected.serviceLimit),
                );
              goTo(selected.monthlyPrice > 0 ? "checkout" : "verification");
            }}
          />
        ) : stage === "verification-failed" ? (
          <VerificationFailed onRetry={() => goTo("verification")} />
        ) : stage === "checkout" ? (
          <Checkout
            plan={plan ?? plans[1]}
            onBack={() => goTo("membership")}
            onSubmit={next}
          />
        ) : (
          <div className="mx-auto max-w-144 space-y-8 px-4 py-10 sm:px-0">
            {stepIndex >= 0 && (
              <StepIndicator
                current={stepIndex + 1}
                total={numbered.length}
                label={onboarding.steps[stage] ?? ""}
              />
            )}
            {content[stage]}
          </div>
        )}
      </main>
    </>
  );
}
