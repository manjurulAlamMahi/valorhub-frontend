import { useAuth } from "@/hooks/use-auth";
import { ApiError, apiPost } from "@/lib/api";
import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  contact,
  initialValues,
  type ContactFormValues,
} from "../data/contact";

type Field = keyof ContactFormValues;
type Errors = Partial<Record<Field, string>>;

const { form } = contact;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mirrors Backend ContactMessageRequest rules
function validate(values: ContactFormValues): Errors {
  const errors: Errors = {};

  for (const field of Object.keys(form.fields) as Field[]) {
    const { label, max } = form.fields[field];
    const value = values[field].trim();
    if (!value) errors[field] = `${label} is required.`;
    else if (value.length > max)
      errors[field] = `${label} must be ${max} characters or fewer.`;
  }

  if (!errors.email && !EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
}

const inputClassName =
  "w-full rounded-lg border border-[#e6eaf2] bg-input px-3.5 py-2.75 text-sm leading-[normal] text-[#1e293b] outline-none placeholder:text-[#64748b] focus:border-secondary-foreground/40 focus:ring-3 focus:ring-secondary-foreground/10 aria-invalid:border-[#c92032]";

export default function ContactForm() {
  const { user } = useAuth();
  // Logged-in users don't need to retype their name and email
  const [values, setValues] = useState(() => ({
    ...initialValues,
    full_name: user?.name ?? "",
    email: user?.email ?? "",
  }));
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const [serverError, setServerError] = useState("");

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    try {
      await apiPost("/contact", {
        full_name: values.full_name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
      });
      setValues(initialValues);
      setStatus("success");
    } catch (error) {
      setStatus("idle");
      if (error instanceof ApiError) {
        const fieldErrors = Object.fromEntries(
          Object.entries(error.fieldErrors).map(([field, messages]) => [
            field,
            messages[0],
          ]),
        );
        setErrors(fieldErrors);
        if (Object.keys(fieldErrors).length === 0)
          setServerError(error.message);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  };

  const renderField = (field: Field, multiline = false) => {
    const { label, placeholder } = form.fields[field];
    const id = `contact-${field}`;
    const error = errors[field];
    const props = {
      id,
      name: field,
      value: values[field],
      placeholder,
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
        {multiline ? (
          <textarea
            {...props}
            rows={5}
            className={cn(inputClassName, "h-33 resize-y p-3.5")}
          />
        ) : (
          <input
            {...props}
            type={field === "email" ? "email" : "text"}
            autoComplete={
              field === "full_name"
                ? "name"
                : field === "email"
                  ? "email"
                  : "off"
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
    <div className="min-w-0 flex-1 rounded-2xl border border-[#e6eaf2] bg-white p-5 sm:p-7">
      <h2 className="text-lg leading-[normal] font-bold text-[#1e293b]">
        {form.title}
      </h2>

      {status === "success" ? (
        <div
          role="status"
          className="mt-4.5 flex flex-col items-center gap-3 rounded-lg bg-[#ecfdf5] px-6 py-10 text-center"
        >
          <CircleCheck aria-hidden className="size-10 text-[#00bc7d]" />
          <p className="max-w-md text-sm text-[#007a55]">{form.success}</p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="text-sm font-medium text-[#c92032] hover:underline"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form noValidate onSubmit={handleSubmit} className="mt-4.5 space-y-4.5">
          <div className="grid gap-4.5 sm:grid-cols-2 sm:gap-4">
            {renderField("full_name")}
            {renderField("email")}
          </div>
          {renderField("subject")}
          {renderField("message", true)}

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
            {status === "submitting" ? form.submitting : form.submit}
          </button>
        </form>
      )}
    </div>
  );
}
