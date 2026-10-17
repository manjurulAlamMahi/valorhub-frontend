import { SEO } from "@/components/seo/SEO";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useState } from "react";
import StatusPill from "../_components/status-pill";
import {
  quoteRequests,
  quoteStatuses,
  type QuoteStatus,
} from "../data/contractor-dashboard";

type Filter = "all" | QuoteStatus;

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  ...(Object.entries(quoteStatuses) as [QuoteStatus, { label: string }][]).map(
    ([value, { label }]) => ({ value, label }),
  ),
];

export default function QuoteRequests() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const search = query.trim().toLowerCase();
  const matches = quoteRequests.filter(
    (quote) =>
      !search ||
      quote.name.toLowerCase().includes(search) ||
      quote.service.toLowerCase().includes(search),
  );
  const items =
    filter === "all"
      ? matches
      : matches.filter((quote) => quote.status === filter);
  const count = (value: Filter) =>
    value === "all"
      ? matches.length
      : matches.filter((quote) => quote.status === value).length;

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
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by customer or service…"
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
                onClick={() => setFilter(value)}
                className={cn(
                  "flex h-7 shrink-0 items-center gap-1 rounded-full px-3.5 text-xs leading-4 font-semibold transition-colors",
                  active
                    ? "bg-[#262262] text-white"
                    : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]",
                )}
              >
                {label}
                <span className="opacity-60">{count(value)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div id="quote-list" role="tabpanel" className="px-4 pt-2 pb-6 sm:px-6">
        {items.length > 0 ? (
          <ul className="overflow-hidden rounded-2xl bg-white">
            {items.map((quote) => (
              <li
                key={quote.id}
                className="flex items-start gap-3 border-b border-[#0f172a]/10 p-4 last:border-b-0"
              >
                <img
                  src={quote.avatar}
                  alt=""
                  className="size-9 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm leading-5 font-semibold text-[#0f172a]">
                      {quote.name}
                    </p>
                    <StatusPill {...quoteStatuses[quote.status]} />
                  </div>
                  <p className="pt-0.5 text-xs leading-4 font-medium text-[#374151]">
                    {quote.service}
                  </p>
                  <p className="flex flex-wrap items-center gap-x-2 pt-1 text-xs leading-4 text-[#64748b]">
                    {quote.budget}
                    <span
                      aria-hidden
                      className="text-base leading-6 text-[#94a3b8]"
                    >
                      ·
                    </span>
                    {quote.location}
                  </p>
                  <p className="pt-0.5 text-xs leading-4 text-[#94a3b8]">
                    {quote.date}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl bg-white p-10 text-center text-sm text-[#64748b]">
            No quote requests match your search.
          </p>
        )}
      </div>
    </>
  );
}
