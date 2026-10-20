import { SEO } from "@/components/seo/SEO";
import QueryBoundary from "@/components/shared/query-boundary";
import { useApi } from "@/hooks/use-api";
import { useAuth } from "@/hooks/use-auth";
import { ApiError, firstFieldErrors } from "@/lib/api";
import { cn } from "@/lib/utils";
import { catalogApi } from "@/services/contractor";
import {
  onboardingApi,
  type ContractorProfileDetail,
  type ProfileExtras,
} from "@/services/onboarding";
import type { CategoriesData } from "@/services/public";
import { CircleCheck } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";

// Flat, string-valued form model over ContractorProfileDetail
type Profile = {
  business_name: string;
  primary_category_id: string;
  address: string;
  bio: string;
  years_experience: string;
  license_number: string;
  insurance_company: string;
  insurance_policy_number: string;
  emergency_service: "On" | "Off";
  languages: string;
};

type Field = {
  key: keyof Profile;
  label: string;
  type?: "text" | "number" | "textarea" | "select";
  options?: { value: string; label: string }[];
  required?: boolean;
  wide?: boolean;
  max?: number;
};

type MediaField = "license_document" | "logo" | "cover_photo";

const documents: {
  key: MediaField;
  label: string;
  accept: string;
  status: keyof ContractorProfileDetail["documents"];
  maxMb: number;
}[] = [
  {
    key: "license_document",
    label: "License & Insurance",
    accept: "application/pdf,image/png,image/jpeg",
    status: "license_status",
    maxMb: 10,
  },
  {
    key: "logo",
    label: "Business Logo",
    accept: "image/png,image/jpeg,image/webp",
    status: "logo_status",
    maxMb: 5,
  },
  {
    key: "cover_photo",
    label: "Cover Photo",
    accept: "image/png,image/jpeg,image/webp",
    status: "cover_photo_status",
    maxMb: 5,
  },
];

const control =
  "w-full rounded-lg border border-[#26225f]/15 bg-[#f7f7fa] px-3 py-2 text-[13px] text-[#26225f] outline-none focus:border-[#26225f]/40 focus:ring-3 focus:ring-[#26225f]/10 aria-invalid:border-[#c41e3a]";

function toProfile(data: ContractorProfileDetail): Profile {
  const info = data.business_info;
  const details = data.professional_details;
  return {
    business_name: info.business_name ?? "",
    primary_category_id: info.primary_category
      ? String(info.primary_category.id)
      : "",
    address:
      info.address ??
      [info.city, [info.state, info.zip_code].filter(Boolean).join(" ")]
        .filter(Boolean)
        .join(", "),
    bio: details.bio ?? "",
    years_experience:
      details.years_experience == null ? "" : String(details.years_experience),
    license_number: details.license_number ?? "",
    insurance_company: details.insurance_company ?? "",
    insurance_policy_number: details.insurance_policy_number ?? "",
    emergency_service: details.emergency_service ? "On" : "Off",
    languages: details.languages.join(", "),
  };
}

// Only the fields of one card are sent, mapped to PUT /contractor/profile
function toPayload(values: Profile, fields: Field[]): ProfileExtras {
  const text = (value: string) => value.trim() || null;
  const payload: Record<string, unknown> = {};
  for (const { key } of fields) {
    const value = values[key];
    if (key === "primary_category_id")
      payload[key] = value ? Number(value) : null;
    else if (key === "years_experience")
      payload[key] = value ? Number(value) : null;
    else if (key === "emergency_service") payload[key] = value === "On";
    else if (key === "languages")
      payload[key] = value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    else if (key === "business_name") payload[key] = value.trim();
    else payload[key] = text(value);
  }
  return payload as ProfileExtras;
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-t border-[#26225f]/8 py-2.5 text-[13px] sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <dt className="shrink-0 text-[#73738c]">{label}</dt>
      <dd className="font-semibold text-[#26225f] sm:text-right">{children}</dd>
    </div>
  );
}

function Card({
  title,
  editing,
  onEdit,
  children,
}: {
  title: string;
  editing: boolean;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <section
      aria-label={title}
      className="space-y-3.5 rounded-xl border border-[#26225f]/10 bg-white px-4 py-5 sm:px-6"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-bold text-[#26225f]">{title}</h2>
        {!editing && (
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg border border-[#26225f] px-3.5 py-1.5 text-xs font-semibold text-[#26225f] hover:bg-[#eeedf8]"
          >
            Edit<span className="sr-only"> {title}</span>
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function EditActions({
  onCancel,
  saving,
}: {
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <div className="flex gap-2 border-t border-[#26225f]/8 pt-3.5">
      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-[#c41e3a] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#a51a31] disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg px-4 py-2 text-[13px] font-medium text-[#26225f] hover:bg-[#f1f5f9]"
      >
        Cancel
      </button>
    </div>
  );
}

function FieldsForm({
  fields,
  values,
  onSaved,
  onCancel,
}: {
  fields: Field[];
  values: Profile;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const { refreshUser } = useAuth();
  const [draft, setDraft] = useState(values);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const next: typeof errors = {};
    for (const field of fields) {
      if (field.required && !draft[field.key].trim())
        next[field.key] = `${field.label} is required.`;
      if (
        field.type === "number" &&
        draft[field.key] &&
        !/^\d{1,3}$/.test(draft[field.key])
      )
        next[field.key] = "Enter a whole number.";
    }
    setErrors(next);
    setFormError("");
    if (Object.keys(next).length) return;

    setSaving(true);
    try {
      await onboardingApi.updateProfile(toPayload(draft, fields));
      // The header and sidebar show the business name from the signed-in user
      if (fields.some((field) => field.key === "business_name"))
        await refreshUser();
      onSaved();
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fieldErrors).length) {
        setErrors(firstFieldErrors(err));
      } else {
        setFormError(
          err instanceof ApiError ? err.message : "Could not save changes.",
        );
      }
      setSaving(false);
    }
  };

  return (
    <form
      noValidate
      onSubmit={(event) => void handleSubmit(event)}
      className="space-y-3.5 border-t border-[#26225f]/8 pt-3.5"
    >
      <div className="grid gap-3.5 sm:grid-cols-2">
        {fields.map((field) => {
          const id = `profile-${field.key}`;
          const props = {
            id,
            value: draft[field.key],
            "aria-invalid": Boolean(errors[field.key]),
            onChange: (event: { target: { value: string } }) =>
              setDraft((prev) => ({
                ...prev,
                [field.key]: event.target.value,
              })),
            className: control,
          };
          return (
            <div
              key={field.key}
              className={cn("space-y-1.5", { "sm:col-span-2": field.wide })}
            >
              <label
                htmlFor={id}
                className="block text-xs font-medium text-[#73738c]"
              >
                {field.label}
              </label>
              {field.type === "select" ? (
                <select {...props}>
                  {field.options!.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  rows={3}
                  maxLength={field.max}
                  {...props}
                  className={cn(control, "resize-y")}
                />
              ) : (
                <input
                  type={field.type === "number" ? "number" : "text"}
                  min={0}
                  maxLength={field.max}
                  {...props}
                />
              )}
              {errors[field.key] && (
                <p className="text-xs text-[#c41e3a]">{errors[field.key]}</p>
              )}
            </div>
          );
        })}
      </div>
      {formError && (
        <p role="alert" className="text-xs text-[#c41e3a]">
          {formError}
        </p>
      )}
      <EditActions onCancel={onCancel} saving={saving} />
    </form>
  );
}

function DocumentsForm({
  profile,
  onSaved,
  onCancel,
}: {
  profile: ContractorProfileDetail;
  onSaved: (message: string) => void;
  onCancel: () => void;
}) {
  const [files, setFiles] = useState<Partial<Record<MediaField, File>>>({});
  const [removed, setRemoved] = useState<MediaField[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      for (const field of removed) await catalogApi.deleteProfileMedia(field);
      if (Object.keys(files).length) await onboardingApi.uploadMedia(files);
      onSaved("Documents updated.");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? (Object.values(err.fieldErrors)[0]?.[0] ?? err.message)
          : "Upload failed.",
      );
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="space-y-3.5 border-t border-[#26225f]/8 pt-3.5"
    >
      {documents.map((doc) => {
        const uploaded = profile.documents[doc.status] !== "Not uploaded";
        const status =
          files[doc.key]?.name ??
          (removed.includes(doc.key)
            ? "Will be removed"
            : profile.documents[doc.status]);
        return (
          <div
            key={doc.key}
            className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="text-[13px]">
              <p className="text-[#73738c]">{doc.label}</p>
              <p className="font-semibold text-[#26225f]">{status}</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="w-fit cursor-pointer rounded-lg border border-[#26225f]/20 px-3.5 py-1.5 text-xs font-semibold text-[#26225f] focus-within:ring-3 focus-within:ring-[#26225f]/20 hover:bg-[#eeedf8]">
                <input
                  type="file"
                  accept={doc.accept}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    if (!file) return;
                    if (file.size > doc.maxMb * 1024 * 1024) {
                      setError(
                        `${doc.label} must be ${doc.maxMb}MB or smaller.`,
                      );
                      return;
                    }
                    setError("");
                    setFiles((prev) => ({ ...prev, [doc.key]: file }));
                    setRemoved((prev) => prev.filter((key) => key !== doc.key));
                  }}
                  className="sr-only"
                />
                {uploaded ? "Replace file" : "Upload file"}
                <span className="sr-only"> for {doc.label}</span>
              </label>
              {uploaded && !removed.includes(doc.key) && !files[doc.key] && (
                <button
                  type="button"
                  onClick={() => setRemoved((prev) => [...prev, doc.key])}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#c41e3a] hover:bg-[#fef2f2]"
                >
                  Remove<span className="sr-only"> {doc.label}</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
      <p className="text-xs text-[#73738c]">
        A new license document is reviewed by ValorHub before it shows as
        verified.
      </p>
      {error && (
        <p role="alert" className="text-xs text-[#c41e3a]">
          {error}
        </p>
      )}
      <EditActions onCancel={onCancel} saving={saving} />
    </form>
  );
}

export default function BusinessProfile() {
  const query = useApi<ContractorProfileDetail>("/contractor/profile");
  const categories = useApi<CategoriesData>("/categories", { type: "service" });
  const [editing, setEditing] = useState<
    "basic" | "details" | "documents" | null
  >(null);
  const [notice, setNotice] = useState("");

  const finish = (message: string) => {
    setEditing(null);
    setNotice(message);
    query.refetch();
  };
  const start = (section: typeof editing) => {
    setEditing(section);
    setNotice("");
  };

  const categoryOptions = [
    { value: "", label: "Choose a category" },
    ...(categories.data?.categories ?? []).map((category) => ({
      value: String(category.id),
      label: category.name,
    })),
  ];

  const basicFields: Field[] = [
    { key: "business_name", label: "Business Name", required: true, max: 255 },
    {
      key: "primary_category_id",
      label: "Business Category",
      type: "select",
      options: categoryOptions,
    },
    { key: "address", label: "Address", wide: true, max: 255 },
    {
      key: "bio",
      label: "Description",
      type: "textarea",
      wide: true,
      max: 2000,
    },
  ];

  const detailFields: Field[] = [
    { key: "years_experience", label: "Years of Experience", type: "number" },
    { key: "license_number", label: "License Number", max: 100 },
    { key: "insurance_company", label: "Insurance Company", max: 255 },
    { key: "insurance_policy_number", label: "Policy Number", max: 100 },
    {
      key: "emergency_service",
      label: "Emergency Service",
      type: "select",
      options: [
        { value: "On", label: "On" },
        { value: "Off", label: "Off" },
      ],
    },
    { key: "languages", label: "Languages (comma separated)" },
  ];

  return (
    <>
      <SEO
        title="Business Profile"
        description="Manage your ValorHub business profile."
        robots="noindex, nofollow"
      />

      <div className="space-y-5 px-4 py-6 sm:px-6">
        {notice && (
          <p
            role="status"
            className="flex items-center gap-2 rounded-lg bg-[#ecfdf5] px-4 py-2.5 text-[13px] font-medium text-[#065f46]"
          >
            <CircleCheck aria-hidden className="size-4" />
            {notice}
          </p>
        )}

        <QueryBoundary query={query}>
          {(data) => {
            const profile = toProfile(data);
            const categoryName = data.business_info.primary_category?.name;
            return (
              <>
                <Card
                  title="Basic Information"
                  editing={editing === "basic"}
                  onEdit={() => start("basic")}
                >
                  {editing === "basic" ? (
                    <FieldsForm
                      fields={basicFields}
                      values={profile}
                      onCancel={() => setEditing(null)}
                      onSaved={() => finish("Basic information updated.")}
                    />
                  ) : (
                    <dl className="space-y-3.5">
                      <Row label="Business Name">
                        {profile.business_name || "—"}
                      </Row>
                      <Row label="Business Category">{categoryName ?? "—"}</Row>
                      <Row label="Address">{profile.address || "—"}</Row>
                      <Row label="Description">{profile.bio || "—"}</Row>
                    </dl>
                  )}
                </Card>

                <Card
                  title="Profile Details"
                  editing={editing === "details"}
                  onEdit={() => start("details")}
                >
                  {editing === "details" ? (
                    <FieldsForm
                      fields={detailFields}
                      values={profile}
                      onCancel={() => setEditing(null)}
                      onSaved={() => finish("Profile details updated.")}
                    />
                  ) : (
                    <dl className="space-y-3.5">
                      <Row label="Years of Experience">
                        {profile.years_experience || "—"}
                      </Row>
                      <Row label="License Number">
                        {profile.license_number || "—"}
                      </Row>
                      <Row label="Insurance Company">
                        {[
                          profile.insurance_company,
                          profile.insurance_policy_number,
                        ]
                          .filter(Boolean)
                          .join(" · ") || "—"}
                      </Row>
                      <Row label="Emergency Service">
                        {profile.emergency_service}
                      </Row>
                      <Row label="Languages">{profile.languages || "—"}</Row>
                    </dl>
                  )}
                </Card>

                <Card
                  title="Documents"
                  editing={editing === "documents"}
                  onEdit={() => start("documents")}
                >
                  {editing === "documents" ? (
                    <DocumentsForm
                      profile={data}
                      onCancel={() => setEditing(null)}
                      onSaved={finish}
                    />
                  ) : (
                    <dl className="space-y-3.5">
                      {documents.map((doc) => (
                        <Row key={doc.key} label={doc.label}>
                          {data.documents[doc.status]}
                        </Row>
                      ))}
                    </dl>
                  )}
                </Card>
              </>
            );
          }}
        </QueryBoundary>
      </div>
    </>
  );
}
