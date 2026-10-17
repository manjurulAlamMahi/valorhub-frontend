import { SEO } from "@/components/seo/SEO";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Banknote,
  CalendarDays,
  FileText,
  Plus,
  Search,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import MarkPaidModal from "../_components/mark-paid-modal";
import SendInvoiceModal from "../_components/send-invoice-modal";
import { Link, useLocation } from "react-router";
import {
  formatDate,
  formatMoney,
  invoices as initialInvoices,
  invoiceStatuses,
  plural,
  type Invoice,
  type InvoiceStatus,
} from "../data/invoices";

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
  note: string;
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
      <p className={cn("pt-0.5 text-xs leading-4", noteClass)}>{note}</p>
    </div>
  );
}

export default function Invoices() {
  const routeState = useLocation().state as {
    created?: Invoice;
    deleted?: string;
  } | null;
  // New and deleted invoices arrive via router state from the other invoice pages
  const [items, setItems] = useState(() =>
    [
      ...(routeState?.created ? [routeState.created] : []),
      ...initialInvoices,
    ].filter((item) => item.id !== routeState?.deleted),
  );
  const [status, setStatus] = useState<StatusFilter>("all");
  const [customer, setCustomer] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [number, setNumber] = useState("");

  const sum = (list: typeof items) =>
    list.reduce((total, item) => total + item.amount, 0);
  const byStatus = (value: InvoiceStatus) =>
    items.filter((item) => item.status === value);
  const outstanding = items.filter(
    (item) => item.status === "pending" || item.status === "overdue",
  );
  const paid = byStatus("paid");
  const overdue = byStatus("overdue");
  const drafts = byStatus("draft");

  const customers = [...new Set(items.map((item) => item.customer))].sort();
  const search = number
    .trim()
    .toLowerCase()
    .replace(/^inv-?/, "");
  const visible = items.filter(
    (item) =>
      (status === "all" || item.status === status) &&
      (customer === "all" || item.customer === customer) &&
      (!from || item.issued >= from) &&
      (!to || item.issued <= to) &&
      (!search || item.id.toLowerCase().includes(search)),
  );

  // Mark Paid and Send confirm in a dialog before changing the status
  const [dialog, setDialog] = useState<{
    type: "paid" | "send";
    invoice: Invoice;
  } | null>(null);
  const closeDialog = () => setDialog(null);

  const setInvoiceStatus = (id: string, next: InvoiceStatus) =>
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: next } : item)),
    );

  return (
    <>
      <SEO
        title="Invoices"
        description="Create, send and track invoices for your ValorHub projects."
        robots="noindex, nofollow"
      />

      <div className="space-y-4 p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatCard
            icon={<Wallet aria-hidden className="size-5 text-[#f59e0b]" />}
            box="bg-[#fffbeb]"
            value={formatMoney(sum(outstanding))}
            label="Total Outstanding"
            note={plural(outstanding.length, "invoice")}
            noteClass="text-[#f59e0b]"
          />
          <StatCard
            icon={<Banknote aria-hidden className="size-5 text-[#10b981]" />}
            box="bg-[#ecfdf5]"
            value={formatMoney(sum(paid))}
            label="Paid This Month"
            note={plural(paid.length, "invoice")}
            noteClass="text-[#10b981]"
          />
          <StatCard
            icon={
              <TriangleAlert aria-hidden className="size-5 text-[#c41e3a]" />
            }
            box="bg-[#fef2f2]"
            value={formatMoney(sum(overdue))}
            label="Overdue"
            note={plural(overdue.length, "invoice")}
            noteClass="text-[#c41e3a]"
          />
          <StatCard
            icon={<FileText aria-hidden className="size-5 text-[#64748b]" />}
            box="bg-[#f1f5f9]"
            value={formatMoney(sum(drafts))}
            label="Draft"
            note={plural(drafts.length, "draft")}
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
            <p className="text-[22px] font-bold text-[#212633]">9 days</p>
            <p className="text-[13px] text-[#8c949e]">
              Average Time to Get Paid
            </p>
            <p className="text-xs font-medium text-[#8c949e]">
              Based on last 90 days
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
              {formatMoney(0, true)}
            </p>
            <p className="text-[13px] text-[#8c949e]">
              Available for Instant Payout
            </p>
            <Link
              to={`${BASE}/payouts`}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#268c59] hover:underline"
            >
              Pay out now
              <ArrowRight aria-hidden className="size-3" />
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <label className="sr-only" htmlFor="invoice-customer">
            Customer
          </label>
          <select
            id="invoice-customer"
            value={customer}
            onChange={(event) => setCustomer(event.target.value)}
            className={cn(filterControl, "w-40", {
              "text-[#8c949e]": customer === "all",
            })}
          >
            <option value="all">All customers</option>
            {customers.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor="invoice-status">
            Status
          </label>
          <select
            id="invoice-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
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
              onChange: setFrom,
            },
            { id: "invoice-to", label: "To", value: to, onChange: setTo },
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
              Invoice number
            </label>
            <input
              id="invoice-number"
              type="search"
              value={number}
              onChange={(event) => setNumber(event.target.value)}
              placeholder="Enter invoice #"
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
                  onClick={() => setStatus(tab.value)}
                  className={cn(
                    "h-7 rounded-full px-3.5 text-xs leading-4 font-semibold transition-colors",
                    status === tab.value
                      ? "bg-[#262262] text-white"
                      : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]",
                  )}
                >
                  {tab.label}
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
            className="relative overflow-x-auto"
          >
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
                {visible.map((invoice) => {
                  const status = invoiceStatuses[invoice.status];
                  const action =
                    invoice.status === "pending" || invoice.status === "overdue"
                      ? {
                          label: "Mark Paid",
                          next: "paid" as const,
                          className: "text-[#f59e0b]",
                        }
                      : invoice.status === "draft"
                        ? {
                            label: "Send",
                            next: "pending" as const,
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
                        {invoice.id}
                      </th>
                      <td className="px-5 py-4 text-[#0f172a]">
                        {invoice.customer}
                      </td>
                      <td className="px-5 py-4 text-[#64748b]">
                        {invoice.project}
                      </td>
                      <td className="px-5 py-4 font-semibold text-[#0f172a]">
                        {formatMoney(invoice.amount)}
                      </td>
                      <td className="px-5 py-4 text-[#64748b]">
                        {formatDate(invoice.issued)}
                      </td>
                      <td
                        className={cn("px-5 py-4 text-[#64748b]", {
                          "text-[#c41e3a]": invoice.status === "overdue",
                        })}
                      >
                        {formatDate(invoice.due)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-0.5 text-xs leading-4 font-semibold",
                            status.className,
                          )}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex w-63.5 items-center justify-between gap-4 text-xs leading-4 font-medium">
                          <Link
                            to={`${BASE}/${invoice.id}`}
                            state={
                              invoice.id === routeState?.created?.id
                                ? { created: routeState.created }
                                : undefined
                            }
                            className="text-[#1b3a6b] hover:underline"
                          >
                            View<span className="sr-only"> {invoice.id}</span>
                          </Link>
                          {action && (
                            <button
                              type="button"
                              onClick={() =>
                                setDialog({
                                  type:
                                    action.next === "paid" ? "paid" : "send",
                                  invoice,
                                })
                              }
                              className={cn(
                                "hover:underline",
                                action.className,
                              )}
                            >
                              {action.label}
                              <span className="sr-only"> {invoice.id}</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {visible.length === 0 && (
              <p className="p-10 text-center text-sm text-[#64748b]">
                No invoices match these filters.
              </p>
            )}
          </div>
        </section>
      </div>

      {dialog?.type === "paid" && (
        <MarkPaidModal
          invoice={dialog.invoice}
          onClose={closeDialog}
          onConfirm={() => {
            setInvoiceStatus(dialog.invoice.id, "paid");
            setDialog(null);
          }}
        />
      )}
      {dialog?.type === "send" && (
        <SendInvoiceModal
          invoice={dialog.invoice}
          onClose={closeDialog}
          onSend={() => {
            setInvoiceStatus(dialog.invoice.id, "pending");
            setDialog(null);
          }}
        />
      )}
    </>
  );
}
