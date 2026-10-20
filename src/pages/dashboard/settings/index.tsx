import { useApi } from "@/hooks/use-api";
import { useAuth } from "@/hooks/use-auth";
import { ApiError, firstFieldErrors } from "@/lib/api";
import { cn } from "@/lib/utils";
import { customerApi, type AccountSettings } from "@/services/customer";
import { CircleCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { ActionButton } from "../_components/action-button";
import DashboardPage from "../_components/dashboard-page";
import QueryBoundary from "@/components/shared/query-boundary";

const inputClassName =
  "bg-input w-full rounded-md border border-[#e6eaf2] px-3.5 py-2.5 text-sm text-[#1e293b] outline-none placeholder:text-[#64748b] focus:border-[#26225f]/40 focus:ring-3 focus:ring-[#26225f]/10 aria-invalid:border-[#c92032]";

const cardClassName =
  "space-y-4.5 rounded-2xl border border-[#e6eaf2] bg-white p-5 leading-[normal] sm:p-7";

type FieldProps = {
  id: string;
  label: string;
  type?: string;
  autoComplete: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

function Field({
  id,
  label,
  type = "text",
  error,
  onChange,
  ...props
}: FieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-[13px] font-medium text-[#1e293b]"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={inputClassName}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-[#c92032]">
          {error}
        </p>
      )}
    </div>
  );
}

function Saved({ children }: { children: string }) {
  return (
    <p
      role="status"
      className="flex items-center gap-1.5 text-sm text-[#16a34a]"
    >
      <CircleCheck aria-hidden className="size-4" />
      {children}
    </p>
  );
}

export default function Settings() {
  const query = useApi<AccountSettings>("/account/settings");

  return (
    <DashboardPage
      title="Settings"
      description="Manage your account information and preferences."
    >
      <QueryBoundary query={query}>
        {(settings) => (
          <div className="space-y-6">
            <ProfileForm settings={settings} />
            <PasswordForm />
          </div>
        )}
      </QueryBoundary>
    </DashboardPage>
  );
}

function ProfileForm({ settings }: { settings: AccountSettings }) {
  const { refreshUser } = useAuth();
  const [values, setValues] = useState({
    name: settings.name,
    email: settings.email,
    phone: settings.phone ?? "",
    emailNotifications:
      settings.notification_preferences.email_notifications ?? true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (field: "name" | "email" | "phone", value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setSaved(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!values.name.trim()) next.name = "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      next.email = "Enter a valid email address.";
    setErrors(next);
    setFormError("");
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      await customerApi.updateSettings({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim() || null,
        notification_preferences: {
          email_notifications: values.emailNotifications,
        },
      });
      // Sidebar and header read the signed-in user
      await refreshUser();
      setSaved(true);
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fieldErrors).length) {
        setErrors(firstFieldErrors(err));
      } else {
        setFormError(
          err instanceof ApiError ? err.message : "Could not save changes.",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      noValidate
      onSubmit={(event) => void handleSubmit(event)}
      className={cardClassName}
    >
      <h2 className="text-base font-bold text-[#1e293b]">Account details</h2>
      <Field
        id="settings-name"
        label="Full name"
        autoComplete="name"
        value={values.name}
        error={errors.name}
        onChange={(value) => update("name", value)}
      />
      <Field
        id="settings-email"
        label="Email address"
        type="email"
        autoComplete="email"
        value={values.email}
        error={errors.email}
        onChange={(value) => update("email", value)}
      />
      <Field
        id="settings-phone"
        label="Phone number"
        type="tel"
        autoComplete="tel"
        value={values.phone}
        error={errors.phone}
        onChange={(value) => update("phone", value)}
      />

      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1 space-y-0.5">
          <p
            id="notifications-label"
            className="text-sm font-medium text-[#1e293b]"
          >
            Email notifications
          </p>
          <p className="text-xs text-[#64748b]">
            Receive updates about quotes and messages.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={values.emailNotifications}
          aria-labelledby="notifications-label"
          onClick={() => {
            setValues((prev) => ({
              ...prev,
              emailNotifications: !prev.emailNotifications,
            }));
            setSaved(false);
          }}
          className={cn(
            "relative h-5.5 w-10 shrink-0 rounded-full bg-[#cbd2e1] transition-colors",
            { "bg-[#16a34a]": values.emailNotifications },
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 size-4.5 rounded-full bg-white shadow transition-transform",
              { "translate-x-4.5": values.emailNotifications },
            )}
          />
        </button>
      </div>

      {formError && (
        <p role="alert" className="text-sm text-[#c92032]">
          {formError}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <ActionButton type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </ActionButton>
        {saved && <Saved>Changes saved</Saved>}
      </div>
    </form>
  );
}

const emptyPasswords = {
  current_password: "",
  password: "",
  password_confirmation: "",
};

function PasswordForm() {
  const [values, setValues] = useState(emptyPasswords);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (field: keyof typeof emptyPasswords, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setSaved(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!values.current_password)
      next.current_password = "Enter your current password.";
    if (values.password.length < 8)
      next.password = "Password must be at least 8 characters.";
    if (values.password_confirmation !== values.password)
      next.password_confirmation = "Passwords don't match.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      await customerApi.changePassword(values);
      setValues(emptyPasswords);
      setSaved(true);
    } catch (err) {
      setErrors(
        err instanceof ApiError && Object.keys(err.fieldErrors).length
          ? firstFieldErrors(err)
          : {
              current_password:
                err instanceof ApiError
                  ? err.message
                  : "Could not update password.",
            },
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      noValidate
      onSubmit={(event) => void handleSubmit(event)}
      className={cardClassName}
    >
      <h2 className="text-base font-bold text-[#1e293b]">Change password</h2>
      <Field
        id="settings-current-password"
        label="Current password"
        type="password"
        autoComplete="current-password"
        value={values.current_password}
        error={errors.current_password}
        onChange={(value) => update("current_password", value)}
      />
      <Field
        id="settings-new-password"
        label="New password"
        type="password"
        autoComplete="new-password"
        value={values.password}
        error={errors.password}
        onChange={(value) => update("password", value)}
      />
      <Field
        id="settings-confirm-password"
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
        value={values.password_confirmation}
        error={errors.password_confirmation}
        onChange={(value) => update("password_confirmation", value)}
      />
      <div className="flex flex-wrap items-center gap-4">
        <ActionButton type="submit" variant="outline" disabled={saving}>
          {saving ? "Updating…" : "Update password"}
        </ActionButton>
        {saved && <Saved>Password updated</Saved>}
      </div>
    </form>
  );
}
