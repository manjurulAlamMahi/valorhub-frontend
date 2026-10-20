import Pagination from "@/components/shared/pagination";
import { useApi } from "@/hooks/use-api";
import type { CustomerInvoice, Paged } from "@/services/customer";
import { useState } from "react";
import { ActionLink } from "../_components/action-button";
import DashboardPage from "../_components/dashboard-page";
import FilterTabs from "../_components/filter-tabs";
import QueryBoundary from "@/components/shared/query-boundary";
import StatusBadge from "../_components/status-badge";

type Tab = "all" | "pending" | "paid";

const tabs: { label: string; value: Tab }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
];

export default function Invoices() {
  const [tab, setTab] = useState<Tab>("all");
  const [page, setPage] = useState(1);
  const query = useApi<Paged<CustomerInvoice>>("/customer/invoices", {
    status: tab === "all" ? null : tab,
    page,
  });

  return (
    <DashboardPage
      title="Invoices"
      description="View and pay invoices from your contractors."
    >
      <FilterTabs
        label="Filter invoices"
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
                {items.map((invoice) => {
                  const isPaid = invoice.status === "paid";
                  return (
                    <li
                      key={invoice.id}
                      className="flex flex-wrap items-center gap-4 rounded-xl border border-[#e6eaf2] bg-white p-4.5 leading-[normal]"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="text-[15px] font-medium text-[#1e293b]">
                          {invoice.invoice_number} ·{" "}
                          {invoice.contractor.business_name}
                        </p>
                        <p className="text-[13px] text-[#64748b]">
                          {isPaid
                            ? `Paid ${invoice.paid_at ?? ""}`
                            : `Due ${invoice.due_at ?? "on receipt"}`}
                        </p>
                      </div>
                      <p className="text-base font-bold text-[#1e293b]">
                        {invoice.amount_display}
                      </p>
                      <StatusBadge status={invoice.status} />
                      <ActionLink
                        to={`/dashboard/invoices/${invoice.id}`}
                        variant={isPaid ? "outline-accent" : "solid"}
                      >
                        {isPaid ? "View" : "Pay now"}
                      </ActionLink>
                    </li>
                  );
                })}
              </ul>
              <Pagination
                page={pagination.current_page}
                totalPages={pagination.last_page}
                onPageChange={setPage}
              />
            </>
          ) : (
            <p className="rounded-xl border border-[#e6eaf2] bg-white p-10 text-center text-sm text-[#64748b]">
              No invoices in this category.
            </p>
          )
        }
      </QueryBoundary>
    </DashboardPage>
  );
}
