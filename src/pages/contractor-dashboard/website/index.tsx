import { SEO } from "@/components/seo/SEO";
import QueryBoundary from "@/components/shared/query-boundary";
import { useApi } from "@/hooks/use-api";
import { useAuth } from "@/hooks/use-auth";
import { ApiError, firstFieldErrors } from "@/lib/api";
import { catalogApi, type WebsiteData } from "@/services/contractor";
import { CircleCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link } from "react-router";

const DOMAIN = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.[a-z0-9-]{1,63})*\.[a-z]{2,}$/i;

const label = "block pb-1.5 text-[13px] font-semibold text-[#26225f]";
const input =
  "w-full rounded-lg border border-[#26225f]/15 bg-[#f7f7fa] px-3.5 py-2.5 text-sm leading-[normal] text-[#26225f] outline-none placeholder:text-[#26225f]/40 focus:border-[#26225f]/40 focus:ring-3 focus:ring-[#26225f]/10 aria-invalid:border-[#c41e3a] disabled:cursor-not-allowed disabled:opacity-60";

export default function Website() {
  const query = useApi<WebsiteData>("/contractor/website");

  return (
    <>
      <SEO
        title="Website"
        description="Manage your ValorHub website and custom domain."
        robots="noindex, nofollow"
      />
      <div className="space-y-5 px-4 py-6 sm:px-6">
        <QueryBoundary query={query}>
          {(website) => (
            <WebsiteSettings website={website} onSaved={query.refetch} />
          )}
        </QueryBoundary>
      </div>
    </>
  );
}

function WebsiteSettings({
  website,
  onSaved,
}: {
  website: WebsiteData;
  onSaved: () => void;
}) {
  const { user } = useAuth();
  const [domain, setDomain] = useState(website.custom_domain ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    // Accept pasted URLs like https://www.example.com/
    const value = domain
      .trim()
      .replace(/^https?:\/\//i, "")
      .replace(/\/+$/, "")
      .toLowerCase();
    if (value && !DOMAIN.test(value)) {
      setError("Enter a valid domain, e.g. yourbusiness.com");
      setSaved(false);
      return;
    }
    setSaving(true);
    setError("");
    try {
      await catalogApi.updateWebsite({ custom_domain: value || null });
      setDomain(value);
      setSaved(true);
      onSaved();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? (firstFieldErrors(err).custom_domain ?? err.message)
          : "Could not save domain settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 rounded-xl border border-[#26225f]/10 bg-white px-5 py-4">
        <span
          aria-hidden
          className={
            website.is_live
              ? "size-2.5 shrink-0 rounded-full bg-[#16a34a]"
              : "size-2.5 shrink-0 rounded-full bg-[#94a3b8]"
          }
        />
        <p className="flex-1 text-sm font-semibold text-[#26225f]">
          {website.is_live
            ? "Your website is live"
            : "Your website goes live once your profile is approved"}
        </p>
        {/* The public profile is the contractor's ValorHub page */}
        <Link
          to={`/contractors/${user?.id}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-[#26225f] bg-white px-4 py-2 text-[13px] leading-[normal] font-semibold text-[#26225f] hover:bg-[#eeedf8]"
        >
          Visit Site
          <span className="sr-only">(opens in a new tab)</span>
        </Link>
      </div>

      <form
        noValidate
        onSubmit={(event) => void handleSubmit(event)}
        className="space-y-4 rounded-xl border border-[#26225f]/10 bg-white p-4 sm:p-6"
      >
        <h1 className="text-base font-bold text-[#26225f]">
          Custom Domain (Elite)
        </h1>
        {!website.can_use_custom_domain && (
          <p className="rounded-lg bg-[#fff7e0] px-3.5 py-2.5 text-[13px] text-[#8c660d]">
            Custom domains are an Elite plan feature.{" "}
            <Link
              to="/contractor/dashboard/subscription"
              className="font-semibold text-[#c41e3a] hover:underline"
            >
              Upgrade to Elite
            </Link>
          </p>
        )}
        <div>
          <label htmlFor="custom-domain" className={label}>
            Custom Domain URL
          </label>
          <input
            id="custom-domain"
            value={domain}
            inputMode="url"
            autoComplete="url"
            placeholder="yourbusiness.com"
            disabled={!website.can_use_custom_domain}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "custom-domain-error" : undefined}
            onChange={(event) => {
              setDomain(event.target.value);
              setError("");
              setSaved(false);
            }}
            className={input}
          />
          {error && (
            <p
              id="custom-domain-error"
              className="pt-1.5 text-xs text-[#c41e3a]"
            >
              {error}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="subdomain" className={label}>
            ValorHub Subdomain (always active)
          </label>
          <input
            id="subdomain"
            value={website.subdomain_display}
            readOnly
            className={`${input} cursor-default text-[#26225f]/60`}
          />
        </div>
        {website.can_use_custom_domain && (
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-[10px] bg-[#c41e3a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#a51a31] disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Domain Settings"}
            </button>
            {saved && (
              <p
                role="status"
                className="flex items-center gap-1.5 text-sm text-[#16a34a]"
              >
                <CircleCheck aria-hidden className="size-4" />
                Domain settings saved
              </p>
            )}
          </div>
        )}
      </form>
    </>
  );
}
