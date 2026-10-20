import { SEO } from "@/components/seo/SEO";
import Pagination from "@/components/shared/pagination";
import QueryBoundary from "@/components/shared/query-boundary";
import UserAvatar from "@/components/shared/user-avatar";
import { useApi } from "@/hooks/use-api";
import { mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import type { LeadsData } from "@/services/contractor";
import { Search } from "lucide-react";
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router";
import { useDebounceValue } from "usehooks-ts";
import LeadDialog from "../_components/lead-dialog";
import StatusPill from "../_components/status-pill";
import { leadStatuses } from "../data/contractor-dashboard";

type Filter = keyof LeadsData["counts"];

// Tab values are the API's lead filters ("new" includes "pending")
const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "quoted", label: "Quote Sent" },
  { value: "accepted", label: "Accepted" },
  { value: "declined", label: "Declined" },
];

export default function QuoteRequests() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [search] = useDebounceValue(query.trim(), 300);

  const leads = useApi<LeadsData>("/contractor/leads", {
    status: filter === "all" ? null : filter,
    search,
    page,
  });
  // ?lead=<id> opens the detail dialog (also used by the dashboard's "View" links)
  const leadId = Number(searchParams.get("lead")) || null;
  const leadQuery = useApi<LeadsData["items"][number]>(
    leadId ? `/contractor/leads/${leadId}` : null,
  );
  const openLead = leadQuery.data?.id === leadId ? leadQuery.data : undefined;

  // Stable so the dialog doesn't re-run its focus effect on every render
  const closeLead = useCallback(
    () =>
      setSearchParams((prev) => {
        prev.delete("lead");
        return prev;
      }),
    [setSearchParams],
  );

  return (
    <>
      <SEO
        title="Quote Requests"
        description="Review and respond to quote requests from ValorHub customers."
        robots="noindex, nofollow"
      />

      <div className="space-y-3 border-b border-[#f1f5f9] px-4 pt-5 pb-4 sm:px-5">
        <div className="relative max-w-153.5">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#0f172a]/50"
          />
          <label htmlFor="quote-search" className="sr-only">
            Search quote requests
          </label>
          <input
            id="quote-search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search by customer, project or reference…"
            className="h-10.5 w-full rounded-lg border border-[#e2e8f0] bg-white pr-4 pl-9 text-sm text-[#0f172a] outline-none placeholder:text-[#0f172a]/50 focus:border-[#262262]/40 focus:ring-3 focus:ring-[#262262]/10"
          />
        </div>

        <div
          role="tablist"
          aria-label="Filter quote requests"
          className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-0.5 sm:mx-0 sm:px-0"
        >
          {filters.map(({ value, label }) => {
            const active = filter === value;
            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="quote-list"
                onClick={() => {
                  setFilter(value);
                  setPage(1);
                }}
                className={cn(
                  "flex h-7 shrink-0 items-center gap-1 rounded-full px-3.5 text-xs leading-4 font-semibold transition-colors",
                  active
                    ? "bg-[#262262] text-white"
                    : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]",
                )}
              >
                {label}
                {leads.data && (
                  <span className="opacity-60">{leads.data.counts[value]}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div id="quote-list" role="tabpanel" className="px-4 pt-2 pb-6 sm:px-6">
        <QueryBoundary query={leads}>
          {({ items, pagination }) =>
            items.length > 0 ? (
              <>
                <ul className="overflow-hidden rounded-2xl bg-white">
                  {items.map((lead) => (
                    <li
                      key={lead.id}
                      className="border-b border-[#0f172a]/10 last:border-b-0"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setSearchParams({ lead: String(lead.id) })
                        }
                        className="flex w-full items-start gap-3 p-4 text-left hover:bg-[#f8fafc]"
                      >
                        <UserAvatar
                          name={lead.customer.name}
                          src={mediaUrl(lead.customer.avatar)}
                          className="size-9"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-start justify-between gap-2">
                            <span className="text-sm leading-5 font-semibold text-[#0f172a]">
                              {lead.customer.name}
                            </span>
                            <StatusPill
                              {...(leadStatuses[lead.status] ?? {
                                label: lead.status_label,
                                tone: "blue",
                              })}
                            />
                          </span>
                          <span className="block pt-0.5 text-xs leading-4 font-medium text-[#374151]">
                            {lead.project_title}
                          </span>
                          <span className="flex flex-wrap items-center gap-x-2 pt-1 text-xs leading-4 text-[#64748b]">
                            {lead.budget.display}
                            <span
                              aria-hidden
                              className="text-base leading-6 text-[#94a3b8]"
                            >
                              ·
                            </span>
                            {lead.location.display}
                          </span>
                          <span className="block pt-0.5 text-xs leading-4 text-[#94a3b8]">
                            {lead.requested_human}
                            {lead.quote_response &&
                              ` · Quoted ${lead.quote_response.display_amount}`}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <Pagination
                  page={pagination.current_page}
                  totalPages={pagination.last_page}
                  onPageChange={setPage}
                />
              </>
            ) : (
              <p className="rounded-2xl bg-white p-10 text-center text-sm text-[#64748b]">
                {search || filter !== "all"
                  ? "No quote requests match your search."
                  : "No quote requests yet. They'll appear here when customers request a quote."}
              </p>
            )
          }
        </QueryBoundary>
      </div>

      {openLead && (
        <LeadDialog
          key={openLead.id}
          lead={openLead}
          onClose={closeLead}
          onChanged={leads.refetch}
        />
      )}
    </>
  );
}
