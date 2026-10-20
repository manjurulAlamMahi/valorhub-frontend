import { SEO } from "@/components/seo/SEO";
import Pagination from "@/components/shared/pagination";
import QueryBoundary from "@/components/shared/query-boundary";
import { useApi } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import type {
  ContractorInvoice,
  InvoiceCustomer,
  InvoicesData,
  InvoiceStatus,
} from "@/services/contractor";
import {
  Banknote,
  CalendarDays,
  FileText,
  Plus,
  Search,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import { useCallback, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { useDebounceValue } from "usehooks-ts";
import MarkPaidModal from "../_components/mark-paid-modal";
import SendInvoiceModal from "../_components/send-invoice-modal";
import { formatMoney, invoiceStatuses } from "../data/invoices";

const BASE = "/contractor/dashboard/invoices";
type StatusFilter = "all" | InvoiceStatus;

const tabs: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "overdue", label: "Overdue" },
  { value: "draft", label: "Draft" },
];

const filterControl =
  "h-8.5 rounded-lg border border-[#e5e8ed] bg-white px-3 text-xs text-[#0f172a] outline-none focus:border-[#262262]/40 focus:ring-3 focus:ring-[#262262]/10";

function StatCard({
  icon,
  box,
  value,
  label,
  note,
  noteClass,
}: {
  icon: ReactNode;
  box: string;
  value: string;
  label: string;
  note?: string;
  noteClass: string;
}) {
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-[0_1px_1.5px_rgba(0,0,0,0.1),0_1px_1px_rgba(0,0,0,0.1)]">
      <span className={cn("grid size-9 place-content-center rounded-lg", box)}>
        {icon}
      </span>
      <p className="pt-3 text-xl leading-7 font-bold text-[#0f172a]">{value}</p>
      <p className="pt-0.5 text-xs leading-4 font-medium text-[#64748b]">
        {label}
      </p>
      {note && (
        <p className={cn("pt-0.5 text-xs leading-4", noteClass)}>{note}</p>
      )}
    </div>
  );
}

export default function Invoices() {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [customerId, setCustomerId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [number, setNumber] = useState("");
  const [search] = useDebounceValue(number.trim(), 300);
  const [page, setPage] = useState(1);

  const query = useApi<InvoicesData>("/contractor/invoices", {
    status: status === "all" ? null : status,
    customer_id: customerId || null,
    from: from || null,
    to: to || null,
    search,
    page,
  });
  const customers = useApi<InvoiceCustomer[]>("/contractor/customers", {
    limit: 100,
  });

  // Every filter change starts from page 1
  const filter =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      setter(value);
      setPage(1);
    };

  // Mark Paid and Send confirm in a dialog before changing the status
  const [dialog, setDialog] = useState<{
    type: "paid" | "send";
    invoice: ContractorInvoice;
  } | null>(null);
  const closeDialog = useCallback(() => setDialog(null), []);
  const done = () => {
    setDialog(null);
    query.refetch();
  };

  const summary = query.data?.summary;

  return (
    <>
      <SEO
        title="Invoices"
        description="Create, send and track invoices for your ValorHub projects."
        robots="noindex, nofollow"
      />

      <div className="space-y-4 p-4 sm:p-6">
        {summary && (
          <>
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              <StatCard
                icon={<Wallet aria-hidden className="size-5 text-[#f59e0b]" />}
                box="bg-[#fffbeb]"
                value={summary.total_outstanding.display}
                label="Total Outstanding"
                note={summary.total_outstanding.label}
                noteClass="text-[#f59e0b]"
              />
              <StatCard
                icon={
                  <Banknote aria-hidden className="size-5 text-[#10b981]" />
                }
                box="bg-[#ecfdf5]"
                value={summary.paid_this_month.display}
                label="Paid This Month"
                noteClass="text-[#10b981]"
              />
              <StatCard
                icon={
                  <TriangleAlert
                    aria-hidden
                    className="size-5 text-[#c41e3a]"
                  />
                }
                box="bg-[#fef2f2]"
                value={summary.overdue.display}
                label="Overdue"
                note={summary.overdue.label}
                noteClass="text-[#c41e3a]"
              />
              <StatCard
                icon={
                  <FileText aria-hidden className="size-5 text-[#64748b]" />
                }
                box="bg-[#f1f5f9]"
                value={summary.draft.display}
                label="Draft"
                note={summary.draft.label}
                noteClass="text-[#64748b]"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2.5 rounded-xl border border-[#e5e8ed] bg-white p-5">
                <span
                  aria-hidden
                  className="grid size-8 place-content-center rounded-lg bg-[#e5f0ff] text-base"
                >
                  ⏱
                </span>
                <p className="text-[22px] font-bold text-[#212633]">
                  {summary.average_days_to_get_paid.display}
                </p>
                <p className="text-[13px] text-[#8c949e]">
                  Average Time to Get Paid
                </p>
                <p className="text-xs font-medium text-[#8c949e]">
                  {summary.average_days_to_get_paid.label}
                </p>
              </div>
              <div className="space-y-2.5 rounded-xl border border-[#e5e8ed] bg-white p-5">
                <span
                  aria-hidden
                  className="grid size-8 place-content-center rounded-lg bg-[#e5f5ed] text-base"
                >
                  ⏱
                </span>
                <p className="text-[22px] font-bold text-[#212633]">
                  {summary.available_for_payout.display}
                </p>
                <p className="text-[13px] text-[#8c949e]">
                  Available for Instant Payout
                </p>
                {/* No payout provider is connected in the API yet */}
                {!summary.available_for_payout.payouts_enabled && (
                  <p className="text-xs font-medium text-[#8c949e]">
                    Instant payouts are coming soon
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <label className="sr-only" htmlFor="invoice-customer">
            Customer
          </label>
          <select
            id="invoice-customer"
            value={customerId}
            onChange={(event) => filter(setCustomerId)(event.target.value)}
            className={cn(filterControl, "w-40", {
              "text-[#8c949e]": !customerId,
            })}
          >
            <option value="">All customers</option>
            {customers.data?.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="invoice-status">
            Status
          </label>
          <select
            id="invoice-status"
            value={status}
            onChange={(event) =>
              filter(setStatus)(event.target.value as StatusFilter)
            }
            className={cn(filterControl, "w-35", {
              "text-[#8c949e]": status === "all",
            })}
          >
            <option value="all">All statuses</option>
            {tabs.slice(1).map((tab) => (
              <option key={tab.value} value={tab.value}>
                {tab.label}
              </option>
            ))}
          </select>
          {[
            {
              id: "invoice-from",
              label: "From",
              value: from,
              onChange: filter(setFrom),
            },
            {
              id: "invoice-to",
              label: "To",
              value: to,
              onChange: filter(setTo),
            },
          ].map((field) => (
            <label
              key={field.id}
              className={cn(
                filterControl,
                "relative flex w-36 items-center gap-1.5 focus-within:border-[#262262]/40",
              )}
            >
              <CalendarDays
                aria-hidden
                className="size-3.5 shrink-0 text-[#8c949e]"
              />
              <span
                className={cn("text-[#8c949e]", { "sr-only": field.value })}
              >
                {field.label}
              </span>
              <input
                id={field.id}
                type="date"
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                className={cn(
                  "min-w-0 flex-1 bg-transparent text-xs outline-none",
                  field.value ? "text-[#0f172a]" : "absolute inset-0 opacity-0",
                )}
              />
            </label>
          ))}
          <div className="relative w-55 max-sm:w-full">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#8c949e]"
            />
            <label className="sr-only" htmlFor="invoice-number">
              Invoice number or customer
            </label>
            <input
              id="invoice-number"
              type="search"
              value={number}
              onChange={(event) => filter(setNumber)(event.target.value)}
              placeholder="Invoice # or customer"
              className={cn(
                filterControl,
                "w-full pl-8 placeholder:text-[#8c949e]",
              )}
            />
          </div>
        </div>

        <section className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f1f5f9] px-5 py-4">
            <div
              role="tablist"
              aria-label="Filter invoices"
              className="flex flex-wrap gap-1.5"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  aria-selected={status === tab.value}
                  aria-controls="invoice-table"
                  onClick={() => filter(setStatus)(tab.value)}
                  className={cn(
                    "flex h-7 items-center gap-1 rounded-full px-3.5 text-xs leading-4 font-semibold transition-colors",
                    status === tab.value
                      ? "bg-[#262262] text-white"
                      : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]",
                  )}
                >
                  {tab.label}
                  {query.data && (
                    <span className="opacity-60">
                      {query.data.counts[tab.value]}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <Link
              to={`${BASE}/new`}
              className="flex items-center gap-2 rounded-lg bg-[#262262] px-4 py-2 text-sm leading-5 font-semibold text-white hover:bg-[#211d53]"
            >
              <Plus aria-hidden className="size-4" />
              Create Invoice
            </Link>
          </div>

          <div
            id="invoice-table"
            role="tabpanel"
            className={cn("relative overflow-x-auto transition-opacity", {
              "opacity-60": query.isLoading && query.data,
            })}
          >
            <QueryBoundary query={query}>
              {({ items, pagination }) => (
                <>
                  <table className="w-full min-w-245 text-left text-sm leading-5">
                    <thead className="border-b border-[#e2e8f0] bg-[#f8fafc] text-xs leading-4 font-semibold text-[#64748b]">
                      <tr>
                        {[
                          "Invoice",
                          "Customer",
                          "Project",
                          "Amount",
                          "Issued",
                          "Due Date",
                          "Status",
                          "Actions",
                        ].map((heading) => (
                          <th
                            key={heading}
                            scope="col"
                            className="px-5 py-3 font-semibold first:pl-5"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((invoice) => {
                        const pill = invoiceStatuses[invoice.status];
                        const action =
                          invoice.status === "pending" ||
                          invoice.status === "overdue"
                            ? {
                                label: "Mark Paid",
                                type: "paid" as const,
                                className: "text-[#f59e0b]",
                              }
                            : invoice.status === "draft"
                              ? {
                                  label: "Send",
                                  type: "send" as const,
                                  className: "text-[#10b981]",
                                }
                              : null;
                        return (
                          <tr
                            key={invoice.id}
                            className="border-b border-[#e6eaf2] last:border-b-0"
                          >
                            <th
                              scope="row"
                              className="px-5 py-4 font-semibold text-[#1b3a6b]"
                            >
                              {invoice.invoice_number}
                            </th>
                            <td className="px-5 py-4 text-[#0f172a]">
                              {invoice.customer.name}
                            </td>
                            <td className="px-5 py-4 text-[#64748b]">
                              {invoice.project?.title ??
                                invoice.items[0]?.name ??
                                "—"}
                            </td>
                            <td className="px-5 py-4 font-semibold text-[#0f172a]">
                              {formatMoney(invoice.amount, true)}
                            </td>
                            <td className="px-5 py-4 text-[#64748b]">
                              {invoice.issued_at}
                            </td>
                            <td
                              className={cn("px-5 py-4 text-[#64748b]", {
                                "text-[#c41e3a]": invoice.status === "overdue",
                              })}
                            >
                              {invoice.due_at}
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className={cn(
                                  "inline-flex rounded-full px-2.5 py-0.5 text-xs leading-4 font-semibold",
                                  pill.className,
                                )}
                              >
                                {pill.label}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex w-63.5 items-center justify-between gap-4 text-xs leading-4 font-medium">
                                <Link
                                  to={`${BASE}/${invoice.id}`}
                                  className="text-[#1b3a6b] hover:underline"
                                >
                                  View
                                  <span className="sr-only">
                                    {" "}
                                    {invoice.invoice_number}
                                  </span>
                                </Link>
                                {action && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setDialog({ type: action.type, invoice })
                                    }
                                    className={cn(
                                      "hover:underline",
                                      action.className,
                                    )}
                                  >
                                    {action.label}
                                    <span className="sr-only">
                                      {" "}
                                      {invoice.invoice_number}
                                    </span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {items.length === 0 && (
                    <p className="p-10 text-center text-sm text-[#64748b]">
                      {query.data?.counts.all === 0
                        ? "No invoices yet. Create your first one."
                        : "No invoices match these filters."}
                    </p>
                  )}
                  <div className="pb-4">
                    <Pagination
                      page={pagination.current_page}
                      totalPages={pagination.last_page}
                      onPageChange={setPage}
                    />
                  </div>
                </>
              )}
            </QueryBoundary>
          </div>
        </section>
      </div>

      {dialog?.type === "paid" && (
        <MarkPaidModal
          invoice={dialog.invoice}
          onClose={closeDialog}
          onPaid={done}
        />
      )}
      {dialog?.type === "send" && (
        <SendInvoiceModal
          invoice={dialog.invoice}
          onClose={closeDialog}
          onSent={done}
        />
      )}
    </>
  );
}
