import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { ActionButton } from "../_components/action-button";
import DashboardPage from "../_components/dashboard-page";
import {
  useDashboard,
  type Settings as SettingsValues,
} from "../data/dashboard-store";

type Field = "name" | "email" | "phone" | "password";

const fields: {
  name: Field;
  label: string;
  type: string;
  autoComplete: string;
}[] = [
  { name: "name", label: "Full name", type: "text", autoComplete: "name" },
  {
    name: "email",
    label: "Email address",
    type: "email",
    autoComplete: "email",
  },
  { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel" },
  {
    name: "password",
    label: "Password",
    type: "password",
    autoComplete: "new-password",
  },
];

export default function Settings() {
  const { state, dispatch } = useDashboard();
  const [values, setValues] = useState({ ...state.settings, password: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [saved, setSaved] = useState(false);

  const update = (field: Field, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSaved(false);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const next: Partial<Record<Field, string>> = {};
    if (!values.name.trim()) next.name = "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      next.email = "Enter a valid email address.";
    if (values.password && values.password.length < 8)
      next.password = "Password must be at least 8 characters.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const settings: SettingsValues = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      emailNotifications: values.emailNotifications,
    };
    dispatch({ type: "saveSettings", settings });
    setValues((prev) => ({ ...prev, password: "" }));
    setSaved(true);
  };

  return (
    <DashboardPage
      title="Settings"
      description="Manage your account information and preferences."
    >
      <form
        noValidate
        onSubmit={handleSubmit}
        className="space-y-4.5 rounded-2xl border border-[#e6eaf2] bg-white p-5 leading-[normal] sm:p-7"
      >
        {fields.map((field) => {
          const id = `settings-${field.name}`;
          const error = errors[field.name];
          return (
            <div key={field.name} className="space-y-2">
              <label
                htmlFor={id}
                className="block text-[13px] font-medium text-[#1e293b]"
              >
                {field.label}
              </label>
              <input
                id={id}
                type={field.type}
                autoComplete={field.autoComplete}
                value={values[field.name]}
                placeholder={field.name === "password" ? "••••••••" : undefined}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
                onChange={(event) => update(field.name, event.target.value)}
                className="bg-input w-full rounded-md border border-[#e6eaf2] px-3.5 py-2.5 text-sm text-[#1e293b] outline-none placeholder:text-[#64748b] focus:border-[#26225f]/40 focus:ring-3 focus:ring-[#26225f]/10 aria-invalid:border-[#c92032]"
              />
              {error && (
                <p id={`${id}-error`} className="text-xs text-[#c92032]">
                  {error}
                </p>
              )}
            </div>
          );
        })}

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

        <div className="flex flex-wrap items-center gap-4">
          <ActionButton type="submit">Save changes</ActionButton>
          {saved && (
            <p
              role="status"
              className="flex items-center gap-1.5 text-sm text-[#16a34a]"
            >
              <CircleCheck aria-hidden className="size-4" />
              Changes saved
            </p>
          )}
        </div>
      </form>
    </DashboardPage>
  );
}
