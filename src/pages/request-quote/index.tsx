import Container from "@/components/shared/container";
import PageLoader from "@/components/shared/page-loader";
import { ErrorState } from "@/components/shared/query-state";
import { SEO } from "@/components/seo/SEO";
import { useApi } from "@/hooks/use-api";
import { useAuth } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api";
import { quotesApi, type WizardConfig } from "@/services/quotes";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import QuoteProgress from "./_components/quote-progress";
import QuoteSuccess from "./_components/quote-success";
import StepBudgetTimeline from "./_components/step-budget-timeline";
import StepCard from "./_components/step-card";
import StepDescription from "./_components/step-description";
import StepLocation, { type LocationField } from "./_components/step-location";
import StepReview from "./_components/step-review";
import StepService from "./_components/step-service";
import { clearDraft, readDraft, saveDraft } from "./data/draft";
import {
  initialValues,
  requestQuote,
  type QuoteFormValues,
} from "./data/request-quote";

type Errors = Partial<Record<string, string>>;

const { steps, service, description, budgetTimeline, location } = requestQuote;
const REVIEW_STEP = steps.length - 1;

// Which wizard step owns each API field, so server errors land on the right step
const fieldStep: Record<string, number> = {
  service_type: 0,
  description: 1,
  budget_range: 2,
  timeline: 2,
  street_address: 3,
  zip_code: 3,
  city: 3,
  state: 3,
};

function validateStep(step: number, values: QuoteFormValues): Errors {
  const errors: Errors = {};

  if (step === 0 && !values.service) errors.service = service.error;

  if (step === 1) {
    const length = values.description.trim().length;
    if (length < description.min)
      errors.description = `Please describe your project (at least ${description.min} characters).`;
  }

  if (step === 2) {
    if (!values.budget) errors.budget = budgetTimeline.budgetError;
    if (!values.timeline) errors.timeline = budgetTimeline.timelineError;
  }

  if (step === 3) {
    for (const [field, config] of Object.entries(location.fields)) {
      if (config.required && !values[field as LocationField].trim())
        errors[field] = `${config.label} is required.`;
    }
  }

  return errors;
}

export default function RequestQuote() {
  const [searchParams] = useSearchParams();
  const contractorParam = searchParams.get("contractor");
  const contractorId =
    contractorParam && /^\d+$/.test(contractorParam) ? contractorParam : null;

  const { data, error, refetch } = useApi<WizardConfig>(
    "/quotes/wizard-config",
    { contractor_id: contractorId },
  );

  return (
    <>
      <SEO
        title={requestQuote.title}
        description="Request a free quote from verified veteran-owned contractors. Describe your project, set your budget and timeline, and get quotes within 24 hours."
        canonical="https://valorhub.com/request-quote"
        robots="noindex, follow"
      />

      <main className="bg-[#f8fafc]">
        <Container className="max-w-300 space-y-6 pt-10! pb-15! md:pt-15!">
          {!data && error ? (
            <ErrorState error={error} onRetry={refetch} />
          ) : !data ? (
            <PageLoader />
          ) : (
            <QuoteWizard
              config={data}
              contractorId={contractorId}
              resume={searchParams.get("resume") === "1"}
            />
          )}
        </Container>
      </main>
    </>
  );
}

type QuoteWizardProps = {
  config: WizardConfig;
  contractorId: string | null;
  // Returning from login/register: restore the saved answers at the review step
  resume: boolean;
};

function QuoteWizard({ config, contractorId, resume }: QuoteWizardProps) {
  const navigate = useNavigate();
  const { user, status } = useAuth();
  const contractor = config.target_contractor;

  const [draft] = useState(() => (resume ? readDraft(contractorId) : null));
  const [step, setStep] = useState(draft ? REVIEW_STEP : 0);
  const [values, setValues] = useState<QuoteFormValues>(() =>
    draft
      ? { ...draft.values, photos: [] }
      : {
          ...initialValues,
          city: config.user_prefill?.city ?? "",
          state: config.user_prefill?.state ?? "",
        },
  );
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [reference, setReference] = useState<string | null>(null);

  const isLast = step === REVIEW_STEP;
  const isBusiness = user?.role === "business";

  // Login/register send the user back here with the draft intact
  const returnPath = `/request-quote?${contractorId ? `contractor=${contractorId}&` : ""}resume=1`;
  const authLink = (path: string) =>
    `${path}?redirect=${encodeURIComponent(returnPath)}`;

  const update = <K extends keyof QuoteFormValues>(
    field: K,
    value: QuoteFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const goTo = (next: number) => {
    setStep(next);
    setSubmitError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToLogin = () => {
    saveDraft(contractorId, values);
    navigate(authLink("/login"));
  };

  const submit = async () => {
    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await quotesApi.create({
        service_type:
          config.service_options.find((option) => option.key === values.service)
            ?.name ?? values.service,
        contractor_id: contractor?.id ?? null,
        description: values.description.trim(),
        budget_range: values.budget,
        timeline: values.timeline,
        street_address: values.street_address.trim() || null,
        zip_code: values.zip_code.trim(),
        city: values.city.trim(),
        state: values.state.trim(),
      });
      clearDraft();
      setReference(response.data.reference_number ?? "");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        // Session ran out mid-wizard; keep the answers and log in again
        goToLogin();
        return;
      }
      if (error instanceof ApiError && Object.keys(error.fieldErrors).length) {
        const fieldErrors: Errors = {};
        let firstStep = REVIEW_STEP;
        for (const [field, messages] of Object.entries(error.fieldErrors)) {
          const key =
            field === "budget_range"
              ? "budget"
              : field === "service_type"
                ? "service"
                : field;
          fieldErrors[key] = messages[0];
          firstStep = Math.min(firstStep, fieldStep[field] ?? firstStep);
        }
        setErrors(fieldErrors);
        goTo(firstStep);
      } else {
        setSubmitError(
          error instanceof ApiError
            ? error.message
            : "Something went wrong. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    const stepErrors = validateStep(step, values);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return;

    if (!isLast) goTo(step + 1);
    else if (!user) goToLogin();
    else void submit();
  };

  // Only customers can submit; guests are asked to log in at the last step
  const authNotice = !isLast ? null : isBusiness ? (
    <p className="rounded-xl bg-[#fef3c6] p-4 text-xs leading-4 text-[#bb4d00]">
      {requestQuote.auth.business}
    </p>
  ) : !user && status !== "loading" ? (
    <p className="rounded-xl bg-[#eef0f8] p-4 text-xs leading-4 text-[#64748b]">
      {requestQuote.auth.guest}{" "}
      <Link
        to={authLink("/register")}
        onClick={() => saveDraft(contractorId, values)}
        className="text-secondary-foreground font-bold hover:underline"
      >
        {requestQuote.auth.register}
      </Link>
    </p>
  ) : null;

  if (reference !== null) return <QuoteSuccess reference={reference} />;

  const stepContent = [
    {
      ...service,
      body: (
        <StepService
          options={config.service_options}
          value={values.service}
          error={errors.service}
          onChange={(value) => update("service", value)}
        />
      ),
    },
    {
      ...description,
      body: (
        <StepDescription
          description={values.description}
          photos={values.photos}
          error={errors.description}
          onDescriptionChange={(value) => update("description", value)}
          onPhotosChange={(photos) => update("photos", photos)}
        />
      ),
    },
    {
      ...budgetTimeline,
      body: (
        <StepBudgetTimeline
          budgets={config.budget_options}
          timelines={config.timeline_options}
          budget={values.budget}
          timeline={values.timeline}
          errors={{ budget: errors.budget, timeline: errors.timeline }}
          onBudgetChange={(value) => update("budget", value)}
          onTimelineChange={(value) => update("timeline", value)}
        />
      ),
    },
    {
      ...location,
      body: (
        <StepLocation
          values={values}
          errors={errors}
          onChange={(field, value) => update(field, value)}
        />
      ),
    },
    {
      ...requestQuote.review,
      body: (
        <StepReview
          config={config}
          values={values}
          recipient={contractor?.business_name}
        />
      ),
    },
  ][step];

  return (
    <>
      {contractor ? (
        <Link
          to={`/contractors/${contractor.id}`}
          className="flex w-fit items-center gap-2 text-sm leading-5 font-medium text-[#64748b] hover:text-[#111827]"
        >
          <ArrowLeft aria-hidden className="size-4" />
          {requestQuote.back}
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm leading-5 font-medium text-[#64748b] hover:text-[#111827]"
        >
          <ArrowLeft aria-hidden className="size-4" />
          {requestQuote.backFallback}
        </button>
      )}

      <QuoteProgress step={step} />

      <StepCard
        key={step}
        title={stepContent.title}
        description={stepContent.description}
        isFirst={step === 0}
        isLast={isLast}
        submitting={submitting}
        error={submitError}
        notice={authNotice}
        nextLabel={
          isLast && !user && status !== "loading"
            ? requestQuote.auth.login
            : undefined
        }
        nextDisabled={isLast && (isBusiness || status === "loading")}
        onPrevious={() => goTo(step - 1)}
        onNext={handleNext}
      >
        {stepContent.body}
      </StepCard>
    </>
  );
}
