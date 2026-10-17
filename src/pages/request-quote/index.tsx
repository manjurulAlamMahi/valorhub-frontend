import Container from "@/components/shared/container";
import { SEO } from "@/components/seo/SEO";
import { ApiError, apiPost } from "@/lib/api";
import { contractors } from "@/pages/contractor-list/data/contractors";
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
import {
  initialValues,
  requestQuote,
  type QuoteFormValues,
} from "./data/request-quote";

type Errors = Partial<Record<string, string>>;

const { steps, service, description, budgetTimeline, location } = requestQuote;

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
  const navigate = useNavigate();
  const contractor = contractors.find(
    (item) => item.id === searchParams.get("contractor"),
  );

  const [step, setStep] = useState(0);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [reference, setReference] = useState<string | null>(null);

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

  const submit = async () => {
    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await apiPost<{ reference_number?: string }>("/quotes", {
        service_type: service.options.find((o) => o.key === values.service)
          ?.label,
        description: values.description.trim(),
        budget_range: values.budget,
        timeline: values.timeline,
        street_address: values.street_address.trim() || null,
        zip_code: values.zip_code.trim(),
        city: values.city.trim(),
        state: values.state.trim(),
      });
      setReference(response.data?.reference_number ?? "");
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.fieldErrors).length) {
        const fieldErrors: Errors = {};
        let firstStep = steps.length - 1;
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

    if (step === steps.length - 1) submit();
    else goTo(step + 1);
  };

  const stepContent = [
    {
      ...service,
      body: (
        <StepService
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
      body: <StepReview values={values} recipient={contractor?.name} />,
    },
  ][step];

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
          {reference !== null ? (
            <QuoteSuccess reference={reference} />
          ) : (
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
                isLast={step === steps.length - 1}
                submitting={submitting}
                error={submitError}
                onPrevious={() => goTo(step - 1)}
                onNext={handleNext}
              >
                {stepContent.body}
              </StepCard>
            </>
          )}
        </Container>
      </main>
    </>
  );
}
