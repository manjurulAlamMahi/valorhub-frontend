import { SEO } from "@/components/seo/SEO";
import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { business } from "../data/invoices";
import { contractor } from "../data/contractor-dashboard";

type Values = {
  name: string;
  email: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
};

const notificationOptions = [
  {
    key: "quotes",
    label: "New quote requests",
    description: "Get notified when a customer sends a quote request",
  },
  {
    key: "messages",
    label: "Messages",
    description: "Get notified for new customer messages",
  },
  {
    key: "payments",
    label: "Invoice payments",
    description: "Get notified when an invoice is paid",
  },
] as const;

type NotificationKey = (typeof notificationOptions)[number]["key"];

const input =
  "w-full rounded-lg border border-[#26225f]/15 bg-[#f7f7fa] px-3.5 py-2.5 text-sm leading-[normal] text-[#26225f]/70 outline-none placeholder:text-[#26225f]/50 focus:border-[#26225f]/40 focus:text-[#26225f] focus:ring-3 focus:ring-[#26225f]/10 aria-invalid:border-[#c41e3a]";

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section
      aria-label={title}
      className="space-y-4 rounded-xl border border-[#26225f]/10 bg-white px-4 py-5 sm:px-6"
    >
      <h2 className="text-base leading-[normal] font-bold text-[#26225f]">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function Settings() {
  const [values, setValues] = useState<Values>({
    name: contractor.name,
    email: business.email,
    phone: "(555) 214-7788",
    currentPassword: "",
    newPassword: "",
  });
  const [notifications, setNotifications] = useState<
    Record<NotificationKey, boolean>
  >({
    quotes: true,
    messages: true,
    payments: true,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>(
    {},
  );
  const [saved, setSaved] = useState(false);

  const update = (key: keyof Values, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setSaved(false);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const next: typeof errors = {};
    if (!values.name.trim()) next.name = "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      next.email = "Enter a valid email address.";
    if (values.phone.replace(/\D/g, "").length < 10)
      next.phone = "Enter a valid phone number.";
    if (values.newPassword) {
      if (!values.currentPassword)
        next.currentPassword = "Enter your current password to change it.";
      if (values.newPassword.length < 8)
        next.newPassword = "New password must be at least 8 characters.";
    }
    setErrors(next);
    if (Object.keys(next).length) {
      document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    setValues((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
    setSaved(true);
  };

  const field = (
    key: keyof Values,
    label: string,
    props: Record<string, string> = {},
  ) => (
    <div className="space-y-1.5">
      <label
        htmlFor={`settings-${key}`}
        className="block text-[13px] leading-[normal] font-semibold text-[#26225f]"
      >
        {label}
      </label>
      <input
        id={`settings-${key}`}
        value={values[key]}
        onChange={(event) => update(key, event.target.value)}
        aria-invalid={Boolean(errors[key])}
        aria-describedby={errors[key] ? `settings-${key}-error` : undefined}
        className={input}
        {...props}
      />
      {errors[key] && (
        <p id={`settings-${key}-error`} className="text-xs text-[#c41e3a]">
          {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <>
      <SEO
        title="Settings"
        description="Manage your ValorHub account settings."
        robots="noindex, nofollow"
      />

      <form
        noValidate
        onSubmit={handleSubmit}
        className="space-y-5 px-4 py-6 sm:px-6"
      >
        <Card title="Account">
          {field("name", "Full Name", { autoComplete: "name" })}
          {field("email", "Business Email", {
            type: "email",
            autoComplete: "email",
          })}
          {field("phone", "Phone Number", { type: "tel", autoComplete: "tel" })}
        </Card>

        <Card title="Password">
          {field("currentPassword", "Current Password", {
            type: "password",
            autoComplete: "current-password",
            placeholder: "••••••••",
          })}
          {field("newPassword", "New Password", {
            type: "password",
            autoComplete: "new-password",
            placeholder: "Min. 8 characters",
          })}
        </Card>

        <Card title="Notifications">
          {notificationOptions.map((option) => (
            <div
              key={option.key}
              className="flex items-center justify-between gap-4 py-2.5 leading-[normal]"
            >
              <div className="space-y-0.5">
                <p
                  id={`notify-${option.key}`}
                  className="text-[13px] font-semibold text-[#26225f]"
                >
                  {option.label}
                </p>
                <p className="text-xs text-[#73738c]">{option.description}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={notifications[option.key]}
                aria-labelledby={`notify-${option.key}`}
                onClick={() => {
                  setNotifications((prev) => ({
                    ...prev,
                    [option.key]: !prev[option.key],
                  }));
                  setSaved(false);
                }}
                className={cn(
                  "relative h-5.5 w-9.5 shrink-0 rounded-full bg-[#d4d4e0] transition-colors",
                  {
                    "bg-[#26225f]": notifications[option.key],
                  },
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 size-4.5 rounded-full bg-white shadow transition-transform",
                    { "translate-x-4": notifications[option.key] },
                  )}
                />
              </button>
            </div>
          ))}
        </Card>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            className="rounded-[10px] bg-[#c41e3a] px-5 py-3 text-sm leading-[normal] font-semibold text-white hover:bg-[#a51a31]"
          >
            Save Changes
          </button>
          {saved && (
            <p
              role="status"
              className="flex items-center gap-1.5 text-sm text-[#16a34a]"
            >
              <CircleCheck aria-hidden className="size-4" />
              Settings saved
            </p>
          )}
        </div>
      </form>
    </>
  );
}
