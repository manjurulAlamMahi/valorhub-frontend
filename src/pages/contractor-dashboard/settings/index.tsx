import { SEO } from "@/components/seo/SEO";
import QueryBoundary from "@/components/shared/query-boundary";
import { useApi } from "@/hooks/use-api";
import { useAuth } from "@/hooks/use-auth";
import { ApiError, firstFieldErrors } from "@/lib/api";
import { cn } from "@/lib/utils";
import { customerApi, type AccountSettings } from "@/services/customer";
import { CircleCheck } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";

type Values = {
  name: string;
  email: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

// Keys are the API's contractor notification_preferences
const notificationOptions = [
  {
    key: "new_quote_requests",
    label: "New quote requests",
    description: "Get notified when a customer sends a quote request",
  },
  {
    key: "messages",
    label: "Messages",
    description: "Get notified for new customer messages",
  },
  {
    key: "invoice_payments",
    label: "Invoice payments",
    description: "Get notified when an invoice is paid",
  },
] as const;

type NotificationKey = (typeof notificationOptions)[number]["key"];

// API field → form field for validation errors
const fieldMap: Record<string, keyof Values> = {
  name: "name",
  email: "email",
  phone: "phone",
  current_password: "currentPassword",
  password: "newPassword",
};

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
  const query = useApi<AccountSettings>("/account/settings");

  return (
    <>
      <SEO
        title="Settings"
        description="Manage your ValorHub account settings."
        robots="noindex, nofollow"
      />
      <QueryBoundary query={query}>
        {(settings) => <SettingsForm settings={settings} />}
      </QueryBoundary>
    </>
  );
}

function SettingsForm({ settings }: { settings: AccountSettings }) {
  const { refreshUser } = useAuth();
  const [values, setValues] = useState<Values>({
    name: settings.name,
    email: settings.email,
    phone: settings.phone ?? "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notifications, setNotifications] = useState<
    Record<NotificationKey, boolean>
  >({
    new_quote_requests:
      settings.notification_preferences.new_quote_requests ?? true,
    messages: settings.notification_preferences.messages ?? true,
    invoice_payments:
      settings.notification_preferences.invoice_payments ?? true,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>(
    {},
  );
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");

  const update = (key: keyof Values, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setSaved("");
  };

  const showApiErrors = (err: unknown) => {
    if (err instanceof ApiError && Object.keys(err.fieldErrors).length) {
      const mapped: typeof errors = {};
      for (const [field, message] of Object.entries(firstFieldErrors(err))) {
        const key = fieldMap[field];
        if (key) mapped[key] = message;
      }
      setErrors(mapped);
    } else {
      setFormError(
        err instanceof ApiError ? err.message : "Could not save settings.",
      );
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const next: typeof errors = {};
    if (!values.name.trim()) next.name = "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      next.email = "Enter a valid email address.";
    if (values.phone && values.phone.replace(/\D/g, "").length < 10)
      next.phone = "Enter a valid phone number.";
    const changingPassword = Boolean(
      values.newPassword || values.currentPassword,
    );
    if (changingPassword) {
      if (!values.currentPassword)
        next.currentPassword = "Enter your current password to change it.";
      if (values.newPassword.length < 8)
        next.newPassword = "New password must be at least 8 characters.";
      if (values.confirmPassword !== values.newPassword)
        next.confirmPassword = "Passwords don't match.";
    }
    setErrors(next);
    setFormError("");
    setSaved("");
    if (Object.keys(next).length) {
      document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    setSaving(true);
    try {
      await customerApi.updateSettings({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim() || null,
        notification_preferences: notifications,
      });
      // Name shows in the header and sidebar
      await refreshUser();
    } catch (err) {
      showApiErrors(err);
      setSaving(false);
      return;
    }

    if (changingPassword) {
      try {
        await customerApi.changePassword({
          current_password: values.currentPassword,
          password: values.newPassword,
          password_confirmation: values.confirmPassword,
        });
        setValues((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } catch (err) {
        showApiErrors(err);
        setSaving(false);
        setSaved("Account details saved; password not changed.");
        return;
      }
    }

    setSaving(false);
    setSaved(
      changingPassword ? "Settings and password saved" : "Settings saved",
    );
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
    <form
      noValidate
      onSubmit={(event) => void handleSubmit(event)}
      className="space-y-5 px-4 py-6 sm:px-6"
    >
      <Card title="Account">
        {field("name", "Full Name", { autoComplete: "name", maxLength: "255" })}
        {field("email", "Business Email", {
          type: "email",
          autoComplete: "email",
          maxLength: "255",
        })}
        {field("phone", "Phone Number", {
          type: "tel",
          autoComplete: "tel",
          maxLength: "50",
        })}
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
        {field("confirmPassword", "Confirm New Password", {
          type: "password",
          autoComplete: "new-password",
          placeholder: "Re-enter new password",
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
                setSaved("");
              }}
              className={cn(
                "relative h-5.5 w-9.5 shrink-0 rounded-full bg-[#d4d4e0] transition-colors",
                { "bg-[#26225f]": notifications[option.key] },
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

      {formError && (
        <p role="alert" className="text-sm text-[#c41e3a]">
          {formError}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-[10px] bg-[#c41e3a] px-5 py-3 text-sm leading-[normal] font-semibold text-white hover:bg-[#a51a31] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        {saved && (
          <p
            role="status"
            className="flex items-center gap-1.5 text-sm text-[#16a34a]"
          >
            <CircleCheck aria-hidden className="size-4" />
            {saved}
          </p>
        )}
      </div>
    </form>
  );
}
