import { useState } from "react";
import { ActionLink } from "../_components/action-button";
import DashboardPage from "../_components/dashboard-page";
import FilterTabs from "../_components/filter-tabs";
import RequestRow from "../_components/request-row";
import { quotes, type RequestStatus } from "../data/dashboard";
import { useDashboard } from "../data/dashboard-store";

type Tab = "all" | Exclude<RequestStatus, "cancelled">;

const tabs: { label: string; value: Tab }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
];

export default function MyRequests() {
  const { state } = useDashboard();
  const [tab, setTab] = useState<Tab>("all");
  const items =
    tab === "all"
      ? state.requests
      : state.requests.filter((request) => request.status === tab);

  return (
    <DashboardPage
      card
      title="My Requests"
      description="Track and manage all your service requests."
    >
      <FilterTabs
        label="Filter requests"
        tabs={tabs}
        value={tab}
        onChange={setTab}
      />

      {items.length > 0 ? (
        <ul className="space-y-3.5">
          {items.map((request) => {
            const hasQuotes = quotes.some(
              (quote) => quote.requestId === request.id,
            );
            return (
              <RequestRow
                key={request.id}
                request={request}
                showDate
                action={
                  <ActionLink
                    variant="outline"
                    to={
                      hasQuotes
                        ? "/dashboard/quotes"
                        : request.status === "completed"
                          ? "/dashboard/invoices"
                          : "/dashboard/inbox"
                    }
                    className="w-25"
                  >
                    View
                  </ActionLink>
                }
              />
            );
          })}
        </ul>
      ) : (
        <p className="rounded-xl border border-[#e6eaf2] p-10 text-center text-sm text-[#64748b]">
          No requests in this category.
        </p>
      )}
    </DashboardPage>
  );
}
