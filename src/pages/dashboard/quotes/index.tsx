import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api";
import { customerApi, type CustomerQuote } from "@/services/customer";
import { useState } from "react";
import { ActionButton, ActionLink } from "../_components/action-button";
import DashboardPage from "../_components/dashboard-page";
import QueryBoundary from "@/components/shared/query-boundary";
import StatusBadge from "../_components/status-badge";

// The API lists every request sent to a contractor; only these have a real quote
const QUOTED = ["quoted", "accepted", "declined", "rejected"];

export default function Quotes() {
  const query = useApi<CustomerQuote[]>("/customer/quotes");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const accept = async (id: number) => {
    setBusyId(id);
    setError("");
    try {
      await customerApi.acceptQuote(id);
      query.refetch();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not accept the quote.",
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <DashboardPage
      card
      title="Quotes"
      description="Quotes received from contractors for your service requests."
    >
      {error && (
        <p role="alert" className="text-sm text-[#c92032]">
          {error}
        </p>
      )}
      <QueryBoundary query={query}>
        {(data) => {
          const quotes = data.filter((quote) => QUOTED.includes(quote.status));
          if (quotes.length === 0) {
            return (
              <p className="rounded-xl border border-[#e6eaf2] p-10 text-center text-sm text-[#64748b]">
                No quotes yet. Contractors usually respond within 24 hours.
              </p>
            );
          }
          return (
            <ul className="space-y-3">
              {quotes.map((quote) => (
                <li
                  key={quote.id}
                  className="flex flex-wrap items-center gap-4 rounded-xl border border-[#e6eaf2] bg-white p-4.5 leading-[normal]"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-[15px] font-medium text-[#1e293b]">
                      {quote.contractor.business_name}
                    </p>
                    <p className="text-[13px] text-[#64748b]">
                      {quote.project_title} · {quote.estimated_duration}
                    </p>
                  </div>
                  <p className="text-secondary-foreground text-lg font-bold">
                    {quote.financials.total_amount_display}
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <ActionLink
                      variant="outline"
                      to={`/dashboard/quotes/${quote.id}`}
                    >
                      View details
                    </ActionLink>
                    {quote.status === "quoted" ? (
                      <ActionButton
                        disabled={busyId === quote.id}
                        onClick={() => void accept(quote.id)}
                      >
                        {busyId === quote.id ? "Accepting…" : "Accept quote"}
                      </ActionButton>
                    ) : (
                      <StatusBadge status={quote.status} />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          );
        }}
      </QueryBoundary>
    </DashboardPage>
  );
}
