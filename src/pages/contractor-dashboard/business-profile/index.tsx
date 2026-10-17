import { SEO } from "@/components/seo/SEO";
import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { businessCategories } from "@/pages/join/data/onboarding";

type Profile = {
  businessName: string;
  category: string;
  address: string;
  description: string;
  years: string;
  license: string;
  insuranceCompany: string;
  policyNumber: string;
  emergency: "On" | "Off";
  languages: string;
};

type Field = {
  key: keyof Profile;
  label: string;
  type?: "text" | "number" | "textarea" | "select";
  options?: readonly string[];
  required?: boolean;
  wide?: boolean;
};

type DocKey = "license" | "logo" | "cover";

const initialProfile: Profile = {
  businessName: "Iron Ridge Contracting",
  category: "Blue Collar",
  address: "123 Main St, Austin, TX 78701",
  description:
    "Full-service remodeling and repair for kitchens, baths, decks & more.",
  years: "12",
  license: "LIC-0001234",
  insuranceCompany: "State Farm",
  policyNumber: "POL-9876543",
  emergency: "Off",
  languages: "English, Spanish",
};

const basicFields: Field[] = [
  { key: "businessName", label: "Business Name", required: true },
  {
    key: "category",
    label: "Business Category",
    type: "select",
    options: businessCategories,
  },
  { key: "address", label: "Address", required: true, wide: true },
  { key: "description", label: "Description", type: "textarea", wide: true },
];

const detailFields: Field[] = [
  { key: "years", label: "Years of Experience", type: "number" },
  { key: "license", label: "License Number" },
  { key: "insuranceCompany", label: "Insurance Company" },
  { key: "policyNumber", label: "Policy Number" },
  {
    key: "emergency",
    label: "Emergency Service",
    type: "select",
    options: ["On", "Off"],
  },
  { key: "languages", label: "Languages" },
];

const documents: { key: DocKey; label: string; accept: string }[] = [
  {
    key: "license",
    label: "License & Insurance",
    accept: "application/pdf,image/png,image/jpeg",
  },
  { key: "logo", label: "Business Logo", accept: "image/png,image/jpeg" },
  { key: "cover", label: "Cover Photo", accept: "image/png,image/jpeg" },
];

const control =
  "w-full rounded-lg border border-[#26225f]/15 bg-[#f7f7fa] px-3 py-2 text-[13px] text-[#26225f] outline-none focus:border-[#26225f]/40 focus:ring-3 focus:ring-[#26225f]/10 aria-invalid:border-[#c41e3a]";

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

function EditActions({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="flex gap-2 border-t border-[#26225f]/8 pt-3.5">
      <button
        type="submit"
        className="rounded-lg bg-[#c41e3a] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#a51a31]"
      >
        Save changes
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
  onSave,
  onCancel,
}: {
  fields: Field[];
  values: Profile;
  onSave: (values: Profile) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(values);
  const [errors, setErrors] = useState<Partial<Record<keyof Profile, string>>>(
    {},
  );

  const handleSubmit = (event: FormEvent) => {
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
    if (Object.keys(next).length === 0) onSave(draft);
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
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
                    <option key={option}>{option}</option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  rows={3}
                  {...props}
                  className={cn(control, "resize-y")}
                />
              ) : (
                <input
                  type={field.type === "number" ? "number" : "text"}
                  min={0}
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
      <EditActions onCancel={onCancel} />
    </form>
  );
}

export default function BusinessProfile() {
  const [profile, setProfile] = useState(initialProfile);
  const [docs, setDocs] = useState<
    Record<DocKey, { status: string; file?: string }>
  >({
    license: { status: "Uploaded · Verified" },
    logo: { status: "Uploaded" },
    cover: { status: "Uploaded" },
  });
  const [docDraft, setDocDraft] = useState<Partial<Record<DocKey, string>>>({});
  const [editing, setEditing] = useState<
    "basic" | "details" | "documents" | null
  >(null);
  const [notice, setNotice] = useState("");

  const finish = (section: string) => {
    setEditing(null);
    setNotice(`${section} updated.`);
  };
  const start = (section: typeof editing) => {
    setEditing(section);
    setNotice("");
    setDocDraft({});
  };

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
              onSave={(values) => {
                setProfile(values);
                finish("Basic information");
              }}
            />
          ) : (
            <dl className="space-y-3.5">
              <Row label="Business Name">{profile.businessName}</Row>
              <Row label="Business Category">{profile.category}</Row>
              <Row label="Address">{profile.address}</Row>
              <Row label="Description">{profile.description || "—"}</Row>
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
              onSave={(values) => {
                setProfile(values);
                finish("Profile details");
              }}
            />
          ) : (
            <dl className="space-y-3.5">
              <Row label="Years of Experience">{profile.years || "—"}</Row>
              <Row label="License Number">{profile.license || "—"}</Row>
              <Row label="Insurance Company">
                {[profile.insuranceCompany, profile.policyNumber]
                  .filter(Boolean)
                  .join(" · ") || "—"}
              </Row>
              <Row label="Emergency Service">{profile.emergency}</Row>
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
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setDocs((prev) => {
                  const next = { ...prev };
                  for (const [key, file] of Object.entries(docDraft) as [
                    DocKey,
                    string,
                  ][])
                    next[key] = {
                      file,
                      // New licenses need to be re-verified by ValorHub
                      status:
                        key === "license"
                          ? "Uploaded · Pending review"
                          : "Uploaded",
                    };
                  return next;
                });
                finish("Documents");
              }}
              className="space-y-3.5 border-t border-[#26225f]/8 pt-3.5"
            >
              {documents.map((doc) => (
                <div
                  key={doc.key}
                  className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="text-[13px]">
                    <p className="text-[#73738c]">{doc.label}</p>
                    <p className="font-semibold text-[#26225f]">
                      {docDraft[doc.key] ??
                        docs[doc.key].file ??
                        docs[doc.key].status}
                    </p>
                  </div>
                  <label className="w-fit cursor-pointer rounded-lg border border-[#26225f]/20 px-3.5 py-1.5 text-xs font-semibold text-[#26225f] focus-within:ring-3 focus-within:ring-[#26225f]/20 hover:bg-[#eeedf8]">
                    <input
                      type="file"
                      accept={doc.accept}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file)
                          setDocDraft((prev) => ({
                            ...prev,
                            [doc.key]: file.name,
                          }));
                        event.target.value = "";
                      }}
                      className="sr-only"
                    />
                    Replace file
                    <span className="sr-only"> for {doc.label}</span>
                  </label>
                </div>
              ))}
              <EditActions onCancel={() => setEditing(null)} />
            </form>
          ) : (
            <dl className="space-y-3.5">
              {documents.map((doc) => (
                <Row key={doc.key} label={doc.label}>
                  {docs[doc.key].status}
                </Row>
              ))}
            </dl>
          )}
        </Card>
      </div>
    </>
  );
}
