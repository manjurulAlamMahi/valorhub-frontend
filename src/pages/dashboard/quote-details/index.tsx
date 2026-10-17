import { NotFound } from "@/pages/NotFound";
import { Link, useParams } from "react-router";
import { ActionButton } from "../_components/action-button";
import StatusBadge from "../_components/status-badge";
import { formatMoney, quotes, quoteTotal } from "../data/dashboard";
import { useDashboard } from "../data/dashboard-store";

export default function QuoteDetails() {
  const { id } = useParams();
  const { state, dispatch } = useDashboard();
  const quote = quotes.find((item) => item.id === id);

  if (!quote) return <NotFound />;

  const request = state.requests.find((item) => item.id === quote.requestId);
  const status = state.quoteStatus[quote.id];
  const lines = [
    { label: "Labor", value: quote.labor },
    { label: "Materials", value: quote.materials },
    { label: "Estimated tax", value: quote.tax },
  ];

  return (
    <section className="space-y-5 leading-[normal]">
      <Link
        to="/dashboard/quotes"
        className="text-[13px] font-medium text-[#64748b] hover:text-[#1e293b]"
      >
        ← Back to Quotes
      </Link>

      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold text-[#1e293b]">
          Quote from {quote.contractor}
        </h1>
        <p className="text-sm text-[#64748b]">
          For: {request?.title} · Submitted {quote.submittedAt}
        </p>
      </div>

      <div className="space-y-4.5 rounded-2xl bg-white p-5 sm:p-7">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="bg-secondary-foreground size-11 shrink-0 rounded-full"
          />
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="text-[15px] font-bold text-[#1e293b]">
              {quote.contractor}
            </p>
            <p className="text-[13px] text-[#64748b]">{quote.contractorMeta}</p>
          </div>
          {status !== "pending" && <StatusBadge status={status} />}
        </div>

        <div className="bg-ring h-px" />

        <h2 className="text-[15px] font-bold text-[#1e293b]">Cost breakdown</h2>
        <dl className="space-y-4.5 text-sm">
          {lines.map((line) => (
            <div key={line.label} className="flex justify-between gap-4">
              <dt className="text-[#64748b]">{line.label}</dt>
              <dd className="text-[#1e293b]">{formatMoney(line.value)}</dd>
            </div>
          ))}
          <div className="bg-ring h-px" />
          <div className="flex justify-between gap-4 text-base font-bold">
            <dt className="text-[#1e293b]">Total quote</dt>
            <dd className="text-secondary-foreground">
              {formatMoney(quoteTotal(quote))}
            </dd>
          </div>
        </dl>

        <div className="space-y-1">
          <h3 className="text-sm font-bold text-[#1e293b]">
            Estimated completion
          </h3>
          <p className="text-[13px] text-[#64748b]">{quote.completion}</p>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-[#1e293b]">
            Notes from contractor
          </h3>
          <p className="text-[13px] text-[#64748b]">{quote.notes}</p>
        </div>

        {status === "pending" && (
          <div className="flex flex-col gap-3 sm:flex-row">
            <ActionButton
              variant="outline"
              className="flex-1"
              onClick={() => dispatch({ type: "declineQuote", id: quote.id })}
            >
              Decline
            </ActionButton>
            <ActionButton
              className="flex-1"
              onClick={() => dispatch({ type: "acceptQuote", id: quote.id })}
            >
              Accept quote
            </ActionButton>
          </div>
        )}
      </div>
    </section>
  );
}
