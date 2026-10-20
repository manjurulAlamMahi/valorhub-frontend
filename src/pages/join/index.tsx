import PageLoader from "@/components/shared/page-loader";
import { ErrorState } from "@/components/shared/query-state";
import { SEO } from "@/components/seo/SEO";
import { useApi } from "@/hooks/use-api";
import { useAuth } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api";
import { setToken } from "@/lib/auth-token";
import {
  onboardingApi,
  type ContractorProfileDetail,
  type MembershipPlan,
  type OnboardingReview,
  type OnboardingStatus,
} from "@/services/onboarding";
import type { CategoriesData } from "@/services/public";
import { useEffect, useState } from "react";
import { Navigate } from "react-router";
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
import { onboarding, toPlan, type Plan, type Stage } from "./data/onboarding";
import {
  initialValues,
  isFreePlan,
  normalizeUrl,
  stagesFor,
  type OnboardingValues,
  type StepProps,
} from "./data/onboarding-state";
import { validate, type Errors } from "./data/validation";

type Category = { id: number; name: string };
type ReviewData = { review: OnboardingReview; licenseStatus: string };

// Saved progress a returning contractor resumes from
type Resume = {
  status: OnboardingStatus;
  profile: ContractorProfileDetail;
  review: ReviewData | null;
};

// API field → form field, so server validation errors land under the right input
const fieldMap: Record<string, keyof OnboardingValues> = {
  email: "email",
  password: "password",
  business_name: "businessName",
  owner_name: "ownerName",
  phone_number: "phone",
  business_type: "businessType",
  terms_accepted: "termsAccepted",
  city: "city",
  state: "state",
  zip_code: "zip",
  address: "street",
  primary_category_id: "category",
  bio: "about",
  years_experience: "yearsExperience",
  license_number: "licenseNumber",
  insurance_company: "insuranceCompany",
  insurance_policy_number: "policyNumber",
  logo: "logo",
  cover_photo: "coverPhoto",
  license_document: "documents",
  website_url: "website",
  facebook_url: "facebook",
  instagram_url: "instagram",
  linkedin_url: "linkedin",
  twitter_url: "twitter",
};

// onboarding_step is the last step the API saved; this is the stage that comes after it
function resumeStage(status: OnboardingStatus, plan: Plan | null): Stage {
  const step = status.onboarding_step;
  if (step <= 2) {
    return status.membership.plan_id && status.membership.status === "past_due"
      ? "checkout"
      : "membership";
  }
  if (step === 3) return "verification";
  if (step === 4) return "business-info";
  if (step === 5) return "profile";
  if (step === 6) return isFreePlan(plan) ? "services" : "social";
  if (step === 7) return "services";
  return "review";
}

function resumeValues(resume: Resume): OnboardingValues {
  const info = resume.profile.business_info;
  const details = resume.profile.professional_details;
  const social = resume.profile.social_links;
  return {
    ...initialValues,
    businessName: info.business_name ?? "",
    ownerName: info.owner_name ?? "",
    phone: info.phone_number ?? "",
    businessType: info.business_type ?? "",
    category: info.primary_category ? String(info.primary_category.id) : "",
    street: info.address ?? "",
    city: info.city ?? "",
    state: info.state ?? "",
    zip: info.zip_code ?? "",
    description: details.bio ?? "",
    about: details.bio ?? "",
    yearsExperience:
      details.years_experience === null ? "" : String(details.years_experience),
    licenseNumber: details.license_number ?? "",
    insuranceCompany: details.insurance_company ?? "",
    policyNumber: details.insurance_policy_number ?? "",
    emergencyService: details.emergency_service,
    availableToday: resume.profile.verifications_and_badges.is_available_today,
    languages: details.languages.join(", "),
    website: social.website_url ?? "",
    facebook: social.facebook_url ?? "",
    instagram: social.instagram_url ?? "",
    linkedin: social.linkedin_url ?? "",
    twitter: social.twitter_url ?? "",
  };
}

async function loadReview(): Promise<ReviewData> {
  const [review, profile] = await Promise.all([
    onboardingApi.review(),
    onboardingApi.contractorProfile(),
  ]);
  return {
    review: review.data,
    licenseStatus: profile.data.documents.license_status,
  };
}

export default function Join() {
  const { user, status, logout } = useAuth();
  // Set once the application is submitted, so the "You're all set" screen
  // isn't replaced by the completed-contractor redirect below
  const [finished, setFinished] = useState(false);

  let content;
  if (status === "loading") {
    content = <PageLoader />;
  } else if (user?.role === "customer") {
    content = (
      <div className="mx-auto max-w-144 px-4 py-16 sm:px-0">
        <section className="space-y-4 rounded-3xl border border-[#26225f]/8 bg-white p-6 text-center sm:p-8">
          <h1 className="font-mono text-2xl font-bold text-[#1a1830]">
            You're signed in as a customer
          </h1>
          <p className="text-sm text-[#6b6e8a]">
            Contractor accounts need their own email address. Log out to create
            a business account.
          </p>
          <button
            type="button"
            onClick={() => void logout()}
            className="h-12 w-full rounded-xl bg-[#c92032] font-bold text-white hover:bg-[#a51a27]"
          >
            Log out
          </button>
        </section>
      </div>
    );
  } else if (user?.business?.onboarding_completed && !finished) {
    return <Navigate to="/contractor/dashboard" replace />;
  } else {
    content = <JoinFlow onFinished={() => setFinished(true)} />;
  }

  return (
    <>
      <SEO
        title={onboarding.seo.title}
        description={onboarding.seo.description}
        canonical="https://valorhub.com/join"
        robots="noindex, follow"
      />
      <main className="bg-input">{content}</main>
    </>
  );
}

// Loads plans, categories and (for a returning contractor) saved progress, then starts the wizard
function JoinFlow({ onFinished }: { onFinished: () => void }) {
  const { user } = useAuth();
  const plansQuery = useApi<{ plans: MembershipPlan[] }>("/membership-plans");
  const categoriesQuery = useApi<CategoriesData>("/categories", {
    type: "service",
  });

  // Only a contractor who was already signed in when /join opened is resuming;
  // one who creates the account here keeps the in-memory wizard state
  const [resuming] = useState(() => user?.role === "business");
  const [resume, setResume] = useState<Resume | null>(null);
  const [resumeError, setResumeError] = useState<ApiError | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!resuming) return;
    let cancelled = false;
    Promise.all([onboardingApi.status(), onboardingApi.contractorProfile()])
      .then(async ([status, profile]) => {
        const review =
          status.data.onboarding_step >= 8 ? await loadReview() : null;
        if (!cancelled) {
          setResume({ status: status.data, profile: profile.data, review });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setResumeError(
            error instanceof ApiError
              ? error
              : new ApiError("Something went wrong. Please try again.", 0),
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [resuming, attempt]);

  const error =
    plansQuery.error ?? categoriesQuery.error ?? resumeError ?? undefined;
  if (error) {
    return (
      <div className="mx-auto max-w-144 px-4 py-16">
        <ErrorState
          error={error}
          onRetry={() => {
            plansQuery.refetch();
            categoriesQuery.refetch();
            setResumeError(null);
            setAttempt((value) => value + 1);
          }}
        />
      </div>
    );
  }

  if (!plansQuery.data || !categoriesQuery.data || (resuming && !resume)) {
    return <PageLoader />;
  }

  return (
    <Wizard
      plans={plansQuery.data.plans.map(toPlan)}
      categories={categoriesQuery.data.categories}
      resume={resume}
      onFinished={onFinished}
    />
  );
}

type WizardProps = {
  plans: Plan[];
  categories: Category[];
  resume: Resume | null;
  onFinished: () => void;
};

function Wizard({ plans, categories, resume, onFinished }: WizardProps) {
  const { user, refreshUser } = useAuth();
  const resumePlan = resume
    ? (plans.find((item) => item.id === resume.status.membership.plan_id) ??
      null)
    : null;

  const [stage, setStage] = useState<Stage>(() =>
    resume ? resumeStage(resume.status, resumePlan) : "account",
  );
  const [plan, setPlan] = useState<Plan | null>(resumePlan);
  const [values, setValues] = useState<OnboardingValues>(() =>
    resume ? resumeValues(resume) : initialValues,
  );
  const [verified, setVerified] = useState(
    resume?.status.verification.is_id_verified ?? false,
  );
  const [review, setReview] = useState<ReviewData | null>(
    resume?.review ?? null,
  );
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const stages = stagesFor(plan);
  // Membership and checkout sit outside the numbered steps
  const numbered = stages.filter((item) => onboarding.steps[item]);
  const stepIndex = numbered.indexOf(stage);

  const goTo = (next: Stage) => {
    setStage(next);
    setErrors({});
    setFormError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const offset = (delta: number) => goTo(stages[stages.indexOf(stage) + delta]);

  const update = <K extends keyof OnboardingValues>(
    field: K,
    value: OnboardingValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Routes field errors to their inputs; anything else becomes the step's banner
  const showError = (error: unknown) => {
    if (error instanceof ApiError && Object.keys(error.fieldErrors).length) {
      const mapped: Errors = {};
      const unmapped: string[] = [];
      for (const [field, messages] of Object.entries(error.fieldErrors)) {
        const key = fieldMap[field.split(".")[0]];
        if (key) mapped[key] = messages[0];
        else unmapped.push(messages[0]);
      }
      setErrors(mapped);
      if (unmapped.length) setFormError(unmapped.join(" "));
      requestAnimationFrame(() =>
        document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus(),
      );
    } else {
      setFormError(
        error instanceof ApiError
          ? error.message
          : "Something went wrong. Please try again.",
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const text = (value: string) => value.trim() || null;

  // Persist the current stage; each one maps to an onboarding endpoint plus,
  // where the design collects more than it accepts, the contractor profile API
  const save = async (current: Stage) => {
    if (current === "account") {
      const response = await onboardingApi.account({
        email: values.email.trim(),
        password: values.password,
        password_confirmation: values.passwordConfirmation,
        business_name: values.businessName.trim(),
        owner_name: values.ownerName.trim(),
        phone_number: values.phone.trim(),
        business_type: values.businessType,
        terms_accepted: values.termsAccepted,
      });
      setToken(response.data.token.access_token);
      await refreshUser();
    }

    if (current === "business-info") {
      await onboardingApi.businessInfo({
        business_name: values.businessName.trim(),
        city: values.city.trim(),
        state: values.state.trim(),
        zip_code: values.zip.trim(),
      });
      await onboardingApi.updateProfile({
        address: text(values.street),
        bio: text(values.description),
        primary_category_id: Number(values.category),
      });
      if (values.logo[0])
        await onboardingApi.uploadMedia({ logo: values.logo[0] });
    }

    if (current === "profile") {
      const years = values.yearsExperience.trim();
      await onboardingApi.profile({
        // One bio field in the API: "About" wins, else the business description
        bio: text(values.about) ?? text(values.description),
        years_experience: years ? Number(years) : null,
      });
      await onboardingApi.updateProfile({
        license_number: text(values.licenseNumber),
        insurance_company: text(values.insuranceCompany),
        insurance_policy_number: text(values.policyNumber),
        emergency_service: values.emergencyService,
        languages: values.languages
          .split(",")
          .map((language) => language.trim())
          .filter(Boolean),
      });
      await onboardingApi.setAvailability(values.availableToday);
      if (values.coverPhoto[0] || values.documents[0]) {
        await onboardingApi.uploadMedia({
          cover_photo: values.coverPhoto[0],
          license_document: values.documents[0],
        });
      }
    }

    if (current === "social") {
      await onboardingApi.socialLinks({
        website_url: normalizeUrl(values.website),
        facebook_url: normalizeUrl(values.facebook),
        instagram_url: normalizeUrl(values.instagram),
        linkedin_url: normalizeUrl(values.linkedin),
        twitter_url: normalizeUrl(values.twitter),
      });
    }

    if (current === "services") {
      // The design picks names only; pricing is set later under My Services
      await onboardingApi.services(
        values.services.map((name) => ({
          category_id: Number(values.category),
          name,
          pricing_type: "custom_quote",
          price: 0,
        })),
      );
    }
  };

  const run = async (task: () => Promise<void>) => {
    setSaving(true);
    setFormError("");
    try {
      await task();
    } catch (error) {
      showError(error);
    } finally {
      setSaving(false);
    }
  };

  const next = () => {
    const stepErrors = validate(stage, values);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    void run(async () => {
      await save(stage);
      const following = stages[stages.indexOf(stage) + 1];
      if (following === "review") setReview(await loadReview());
      goTo(following);
    });
  };

  const selectPlan = (selected: Plan) =>
    run(async () => {
      const response = await onboardingApi.selectPlan(selected.id);
      setPlan(selected);
      // Keep the picked services within the new plan's limit
      if (selected.serviceLimit !== null)
        update("services", values.services.slice(0, selected.serviceLimit));
      goTo(response.data.requires_payment ? "checkout" : "verification");
    });

  const submitApplication = () =>
    run(async () => {
      await onboardingApi.submit();
      onFinished();
      await refreshUser();
      goTo("done");
    });

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
        onVerify={async () => {
          // ApiError is an Error, so the step shows the server's message
          await onboardingApi.verifyIdMe();
          setVerified(true);
        }}
        onFailed={() => goTo("verification-failed")}
        onSubmit={next}
        // Checkout is already paid by now, so back means changing plans
        onBack={() => goTo("membership")}
      />
    ),
    "business-info": (
      <StepBusinessInfo {...stepProps} categories={categories} />
    ),
    profile: <StepBusinessProfile {...stepProps} free={isFreePlan(plan)} />,
    social: <StepSocialLinks {...stepProps} />,
    services: <StepServices {...stepProps} plan={plan ?? plans[0]} />,
    review: review && (
      <StepReview
        review={review.review}
        licenseStatus={review.licenseStatus}
        onSubmit={submitApplication}
        onBack={() => offset(-1)}
      />
    ),
    done: (
      <AccountCreated
        accountNumber={`VH-CT-${new Date().getFullYear()}-${String(user?.id ?? "").padStart(4, "0")}`}
      />
    ),
  };

  const banner = formError && (
    <p
      role="alert"
      className="rounded-xl bg-[#c92032]/8 px-4 py-3 text-sm leading-5 text-[#c92032]"
    >
      {formError}
    </p>
  );

  if (stage === "membership") {
    return (
      <Membership
        plans={plans}
        onSelect={(selected) => void selectPlan(selected)}
        saving={saving}
        error={formError}
      />
    );
  }

  if (stage === "verification-failed") {
    return <VerificationFailed onRetry={() => goTo("verification")} />;
  }

  if (stage === "checkout") {
    return (
      <Checkout
        plan={plan ?? plans[1]}
        onBack={() => goTo("membership")}
        onSubmit={async (payload) => {
          await onboardingApi.checkout(payload);
          goTo("verification");
        }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-144 space-y-8 px-4 py-10 sm:px-0">
      {stepIndex >= 0 && (
        <StepIndicator
          current={stepIndex + 1}
          total={numbered.length}
          label={onboarding.steps[stage] ?? ""}
        />
      )}
      {banner}
      {/* Locks the step's inputs and buttons while it saves */}
      <fieldset disabled={saving} aria-busy={saving} className="min-w-0">
        {content[stage]}
      </fieldset>
    </div>
  );
}
