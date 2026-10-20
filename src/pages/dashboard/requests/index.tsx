import Pagination from "@/components/shared/pagination";
import { useApi } from "@/hooks/use-api";
import type { Paged, ServiceRequest } from "@/services/customer";
import { useState } from "react";
import { ActionLink } from "../_components/action-button";
import DashboardPage from "../_components/dashboard-page";
import FilterTabs from "../_components/filter-tabs";
import QueryBoundary from "@/components/shared/query-boundary";
import RequestRow from "../_components/request-row";

type Tab = "all" | "new" | "quoted" | "accepted" | "rejected";

// Tab values are the API's quote request statuses
const tabs: { label: string; value: Tab }[] = [
  { label: "All", value: "all" },
  { label: "Awaiting quote", value: "new" },
  { label: "Quote received", value: "quoted" },
  { label: "Accepted", value: "accepted" },
  { label: "Declined", value: "rejected" },
];

export default function MyRequests() {
  const [tab, setTab] = useState<Tab>("all");
  const [page, setPage] = useState(1);
  const query = useApi<Paged<ServiceRequest>>("/customer/requests", {
    status: tab === "all" ? null : tab,
    page,
  });

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
        onChange={(next) => {
          setTab(next);
          setPage(1);
        }}
      />

      <QueryBoundary query={query}>
        {({ items, pagination }) =>
          items.length > 0 ? (
            <>
              <ul className="space-y-3.5">
                {items.map((request) => (
                  <RequestRow
                    key={request.id}
                    request={request}
                    showDate
                    action={
                      <ActionLink
                        variant="outline"
                        to={`/dashboard/quotes/${request.id}`}
                        className="w-25"
                      >
                        View
                      </ActionLink>
                    }
                  />
                ))}
              </ul>
              <Pagination
                page={pagination.current_page}
                totalPages={pagination.last_page}
                onPageChange={setPage}
              />
            </>
          ) : (
            <p className="rounded-xl border border-[#e6eaf2] p-10 text-center text-sm text-[#64748b]">
              No requests in this category.
            </p>
          )
        }
      </QueryBoundary>
    </DashboardPage>
  );
}
