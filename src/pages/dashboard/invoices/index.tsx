import { useState } from "react";
import { ActionLink } from "../_components/action-button";
import DashboardPage from "../_components/dashboard-page";
import FilterTabs from "../_components/filter-tabs";
import StatusBadge from "../_components/status-badge";
import {
  formatMoney,
  invoiceTotal,
  type InvoiceStatus,
} from "../data/dashboard";
import { useDashboard } from "../data/dashboard-store";

type Tab = "all" | InvoiceStatus;

const tabs: { label: string; value: Tab }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
];

export default function Invoices() {
  const { state } = useDashboard();
  const [tab, setTab] = useState<Tab>("all");
  const items =
    tab === "all"
      ? state.invoices
      : state.invoices.filter((invoice) => invoice.status === tab);

  return (
    <DashboardPage
      title="Invoices"
      description="View and pay invoices from your contractors."
    >
      <FilterTabs
        label="Filter invoices"
        tabs={tabs}
        value={tab}
        onChange={setTab}
      />

      {items.length > 0 ? (
        <ul className="space-y-3.5">
          {items.map((invoice) => (
            <li
              key={invoice.id}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-[#e6eaf2] bg-white p-4.5 leading-[normal]"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-[15px] font-medium text-[#1e293b]">
                  {invoice.id} · {invoice.contractor}
                </p>
                <p className="text-[13px] text-[#64748b]">
                  {invoice.status === "paid"
                    ? `Paid ${invoice.paidAt}`
                    : `Due ${invoice.dueAt}`}
                </p>
              </div>
              <p className="text-base font-bold text-[#1e293b]">
                {formatMoney(invoiceTotal(invoice))}
              </p>
              <StatusBadge status={invoice.status} />
              <ActionLink
                to={`/dashboard/invoices/${invoice.id}`}
                variant={invoice.status === "paid" ? "outline-accent" : "solid"}
              >
                {invoice.status === "paid" ? "View" : "Pay now"}
              </ActionLink>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-[#e6eaf2] bg-white p-10 text-center text-sm text-[#64748b]">
          No invoices in this category.
        </p>
      )}
    </DashboardPage>
  );
}
