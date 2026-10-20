import UserAvatar from "@/components/shared/user-avatar";
import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api";
import { mediaUrl } from "@/lib/media";
import { NotFound } from "@/pages/NotFound";
import { customerApi, type CustomerQuote } from "@/services/customer";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { ActionButton } from "../_components/action-button";
import QueryBoundary from "@/components/shared/query-boundary";
import StatusBadge from "../_components/status-badge";

// Statuses where the contractor hasn't sent pricing yet
const AWAITING = ["new", "pending"];

export default function QuoteDetails() {
  const { id } = useParams();
  const valid = /^\d+$/.test(id ?? "");
  const query = useApi<CustomerQuote>(valid ? `/customer/quotes/${id}` : null);
  const [busy, setBusy] = useState<"accept" | "decline" | null>(null);
  const [error, setError] = useState("");

  if (!valid || query.error?.status === 404) return <NotFound />;

  const respond = async (action: "accept" | "decline") => {
    setBusy(action);
    setError("");
    try {
      await (action === "accept"
        ? customerApi.acceptQuote(Number(id))
        : customerApi.declineQuote(Number(id)));
      query.refetch();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="space-y-5 leading-[normal]">
      <Link
        to="/dashboard/quotes"
        className="text-[13px] font-medium text-[#64748b] hover:text-[#1e293b]"
      >
        ← Back to Quotes
      </Link>

      <QueryBoundary query={query}>
        {(quote) => {
          const awaiting = AWAITING.includes(quote.status);
          const lines = [
            { label: "Labor", value: quote.financials.labor_cost_display },
            {
              label: "Materials",
              value: quote.financials.materials_cost_display,
            },
            {
              label: "Estimated tax",
              value: quote.financials.tax_cost_display,
            },
          ];

          return (
            <>
              <div className="space-y-1.5">
                <h1 className="text-2xl font-bold text-[#1e293b]">
                  {awaiting
                    ? quote.project_title
                    : `Quote from ${quote.contractor.business_name}`}
                </h1>
                <p className="text-sm text-[#64748b]">
                  For: {quote.project_title} · Request #{quote.reference_number}
                  {quote.requested_at && ` · ${quote.requested_at}`}
                </p>
              </div>

              <div className="space-y-4.5 rounded-2xl bg-white p-5 sm:p-7">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    name={quote.contractor.business_name}
                    src={mediaUrl(quote.contractor.avatar)}
                    className="size-11"
                  />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-[15px] font-bold text-[#1e293b]">
                      {quote.contractor.business_name}
                    </p>
                    <p className="text-[13px] text-[#64748b]">
                      ★ {quote.contractor.rating.toFixed(1)} (
                      {quote.contractor.review_count} reviews) ·{" "}
                      {quote.contractor.location}
                    </p>
                  </div>
                  <StatusBadge status={quote.status} />
                </div>

                <div className="bg-ring h-px" />

                {awaiting ? (
                  <div className="space-y-2">
                    <p className="text-sm text-[#64748b]">
                      {quote.contractor.business_name} hasn't sent pricing yet.
                      You'll be notified when the quote arrives.
                    </p>
                    <h2 className="pt-2 text-sm font-bold text-[#1e293b]">
                      Your request
                    </h2>
                    <p className="text-[13px] text-[#64748b]">
                      {quote.description}
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-[15px] font-bold text-[#1e293b]">
                      Cost breakdown
                    </h2>
                    <dl className="space-y-4.5 text-sm">
                      {lines.map((line) => (
                        <div
                          key={line.label}
                          className="flex justify-between gap-4"
                        >
                          <dt className="text-[#64748b]">{line.label}</dt>
                          <dd className="text-[#1e293b]">{line.value}</dd>
                        </div>
                      ))}
                      <div className="bg-ring h-px" />
                      <div className="flex justify-between gap-4 text-base font-bold">
                        <dt className="text-[#1e293b]">Total quote</dt>
                        <dd className="text-secondary-foreground">
                          {quote.financials.total_amount_display}
                        </dd>
                      </div>
                    </dl>

                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-[#1e293b]">
                        Estimated completion
                      </h3>
                      <p className="text-[13px] text-[#64748b]">
                        {quote.estimated_duration}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-[#1e293b]">
                        Notes from contractor
                      </h3>
                      <p className="text-[13px] text-[#64748b]">
                        {quote.contractor_notes}
                      </p>
                    </div>
                  </>
                )}

                {error && (
                  <p role="alert" className="text-sm text-[#c92032]">
                    {error}
                  </p>
                )}

                {quote.status === "quoted" && (
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <ActionButton
                      variant="outline"
                      className="flex-1"
                      disabled={busy !== null}
                      onClick={() => void respond("decline")}
                    >
                      {busy === "decline" ? "Declining…" : "Decline"}
                    </ActionButton>
                    <ActionButton
                      className="flex-1"
                      disabled={busy !== null}
                      onClick={() => void respond("accept")}
                    >
                      {busy === "accept" ? "Accepting…" : "Accept quote"}
                    </ActionButton>
                  </div>
                )}
              </div>
            </>
          );
        }}
      </QueryBoundary>
    </section>
  );
}
