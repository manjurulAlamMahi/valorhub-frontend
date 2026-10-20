import Breadcrumb from "@/components/shared/breadcrumb";
import Container from "@/components/shared/container";
import Section from "@/components/shared/section";
import { SEO } from "@/components/seo/SEO";
import { useAuth } from "@/hooks/use-auth";
import { ApiError, firstFieldErrors } from "@/lib/api";
import { cn } from "@/lib/utils";
import { publicApi, type NominationPayload } from "@/services/public";
import { CircleCheck } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router";

type Values = Record<keyof NominationPayload, string>;
type Field = keyof Values;
type Errors = Partial<Record<Field, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const branches = [
  "U.S. Army",
  "U.S. Navy",
  "U.S. Air Force",
  "U.S. Marine Corps",
  "U.S. Coast Guard",
  "U.S. Space Force",
  "National Guard",
  "First Responder",
];

// Mirrors Backend NominateVeteranRequest rules
const fields: Record<
  Field,
  { label: string; placeholder?: string; max: number; required?: boolean }
> = {
  nominator_name: {
    label: "Your name",
    placeholder: "Sarah Johnson",
    max: 255,
    required: true,
  },
  nominator_email: {
    label: "Your email",
    placeholder: "sarah.j@email.com",
    max: 255,
    required: true,
  },
  nominator_phone: {
    label: "Your phone (optional)",
    placeholder: "(555) 000-0000",
    max: 50,
  },
  nominee_name: {
    label: "Veteran's name",
    placeholder: "James Whitfield",
    max: 255,
    required: true,
  },
  nominee_branch: { label: "Branch of service", max: 100 },
  nominee_city: { label: "City", placeholder: "Phoenix", max: 100 },
  nominee_state: { label: "State", placeholder: "AZ", max: 100 },
  project_needed: {
    label: "Project needed",
    placeholder: "Wheelchair ramp, roof repair…",
    max: 255,
    required: true,
  },
  story_details: {
    label: "Their story",
    placeholder: "Tell us about the veteran and why they need help…",
    max: 5000,
    required: true,
  },
};

function validate(values: Values): Errors {
  const errors: Errors = {};
  for (const field of Object.keys(fields) as Field[]) {
    const { label, max, required } = fields[field];
    const value = values[field].trim();
    if (required && !value) errors[field] = `${label} is required.`;
    else if (value.length > max)
      errors[field] = `${label} must be ${max} characters or fewer.`;
  }
  if (
    !errors.nominator_email &&
    !EMAIL_PATTERN.test(values.nominator_email.trim())
  ) {
    errors.nominator_email = "Enter a valid email address.";
  }
  return errors;
}

const inputClassName =
  "w-full rounded-lg border border-[#e6eaf2] bg-input px-3.5 py-2.75 text-sm leading-[normal] text-[#1e293b] outline-none placeholder:text-[#64748b] focus:border-secondary-foreground/40 focus:ring-3 focus:ring-secondary-foreground/10 aria-invalid:border-[#c92032]";

export default function NominateVeteran() {
  const { user } = useAuth();
  const blank = Object.fromEntries(
    Object.keys(fields).map((field) => [field, ""]),
  ) as Values;
  const [values, setValues] = useState<Values>(() => ({
    ...blank,
    nominator_name: user?.name ?? "",
    nominator_email: user?.email ?? "",
  }));
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const field = event.target.name as Field;
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError("");

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const payload = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [
          key,
          value.trim() || null,
        ]),
      ) as NominationPayload;
      const response = await publicApi.nominateVeteran(payload);
      setSuccessMessage(response.message);
      setStatus("success");
    } catch (error) {
      setStatus("idle");
      const fieldErrors =
        error instanceof ApiError ? firstFieldErrors(error) : {};
      if (Object.keys(fieldErrors).length) setErrors(fieldErrors);
      else
        setServerError(
          error instanceof ApiError
            ? error.message
            : "Something went wrong. Please try again.",
        );
    }
  };

  const renderField = (
    field: Field,
    type: "input" | "textarea" | "select" = "input",
  ) => {
    const { label, placeholder } = fields[field];
    const id = `nominate-${field}`;
    const error = errors[field];
    const props = {
      id,
      name: field,
      value: values[field],
      onChange: handleChange,
      "aria-invalid": Boolean(error),
      "aria-describedby": error ? `${id}-error` : undefined,
    };

    return (
      <div className="space-y-2">
        <label
          htmlFor={id}
          className="block text-[13px] leading-[normal] font-medium text-[#1e293b]"
        >
          {label}
        </label>
        {type === "textarea" ? (
          <textarea
            {...props}
            placeholder={placeholder}
            rows={6}
            className={cn(inputClassName, "h-40 resize-y p-3.5")}
          />
        ) : type === "select" ? (
          <select {...props} className={cn(inputClassName, "cursor-pointer")}>
            <option value="">Select a branch</option>
            {branches.map((branch) => (
              <option key={branch}>{branch}</option>
            ))}
          </select>
        ) : (
          <input
            {...props}
            placeholder={placeholder}
            type={
              field === "nominator_email"
                ? "email"
                : field === "nominator_phone"
                  ? "tel"
                  : "text"
            }
            className={inputClassName}
          />
        )}
        {error && (
          <p id={`${id}-error`} className="text-xs text-[#c92032]">
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      <SEO
        title="Nominate a Veteran"
        description="Tell us about a veteran or first responder who could benefit from the ValorHub home repair grant program."
        canonical="https://valorhub.com/giving-back/nominate"
      />

      <main className="bg-input">
        <Section>
          <Container className="space-y-4 pt-6! pb-10! xl:max-w-200">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Giving Back", href: "/giving-back" },
                { label: "Nominate", href: "/giving-back/nominate" },
              ]}
            />

            <div className="rounded-2xl border border-[#e6eaf2] bg-white p-5 sm:p-7">
              <h1 className="text-2xl leading-[normal] font-bold text-[#1e293b]">
                Nominate a veteran in need
              </h1>
              <p className="pt-2 text-sm text-[#64748b]">
                Tell us about a veteran or first responder who could benefit
                from our home repair grant program.
              </p>

              {status === "success" ? (
                <div
                  role="status"
                  className="mt-6 flex flex-col items-center gap-3 rounded-lg bg-[#ecfdf5] px-6 py-10 text-center"
                >
                  <CircleCheck aria-hidden className="size-10 text-[#00bc7d]" />
                  <p className="max-w-md text-sm text-[#007a55]">
                    {successMessage}
                  </p>
                  <Link
                    to="/giving-back"
                    className="text-sm font-medium text-[#c92032] hover:underline"
                  >
                    Back to Giving Back
                  </Link>
                </div>
              ) : (
                <form
                  noValidate
                  onSubmit={handleSubmit}
                  className="mt-6 space-y-4.5"
                >
                  <fieldset className="space-y-4.5">
                    <legend className="pb-1 text-sm font-bold text-[#1e293b]">
                      About you
                    </legend>
                    <div className="grid gap-4.5 sm:grid-cols-2 sm:gap-4">
                      {renderField("nominator_name")}
                      {renderField("nominator_email")}
                    </div>
                    {renderField("nominator_phone")}
                  </fieldset>

                  <fieldset className="space-y-4.5 pt-2">
                    <legend className="pb-1 text-sm font-bold text-[#1e293b]">
                      About the veteran
                    </legend>
                    <div className="grid gap-4.5 sm:grid-cols-2 sm:gap-4">
                      {renderField("nominee_name")}
                      {renderField("nominee_branch", "select")}
                      {renderField("nominee_city")}
                      {renderField("nominee_state")}
                    </div>
                    {renderField("project_needed")}
                    {renderField("story_details", "textarea")}
                  </fieldset>

                  {serverError && (
                    <p role="alert" className="text-sm text-[#c92032]">
                      {serverError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full rounded-md bg-[#c92032] px-6 py-3 text-base leading-6 font-bold text-white transition-colors hover:bg-[#c92032]/90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {status === "submitting"
                      ? "Submitting…"
                      : "Submit nomination"}
                  </button>
                </form>
              )}
            </div>
          </Container>
        </Section>
      </main>
    </>
  );
}
