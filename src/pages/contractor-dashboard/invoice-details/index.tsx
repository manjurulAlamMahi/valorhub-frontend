import { SEO } from "@/components/seo/SEO";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Circle,
  Copy,
  Dot,
  Download,
  Trash2,
} from "lucide-react";
import MarkPaidModal from "../_components/mark-paid-modal";
import SendInvoiceModal from "../_components/send-invoice-modal";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { contractor } from "../data/contractor-dashboard";
import {
  business,
  customerDetails,
  formatDate,
  formatMoney,
  invoices,
  invoiceStatuses,
  itemDescriptions,
  type Invoice,
  type InvoiceStatus,
} from "../data/invoices";

const BASE = "/contractor/dashboard/invoices";

type StepState = "done" | "current" | "upcoming";

const stepBadge: Record<StepState, string> = {
  done: "bg-[#e5f5ed] text-[#268c59]",
  current: "bg-[#c41e3a]/12 text-[#c41e3a]",
  upcoming: "bg-[#f5f5f7] text-[#a6abb2]",
};

const pillStyles: Record<InvoiceStatus, string> = {
  draft: "bg-[#edf0f2] text-[#8c949e]",
  pending: "bg-[#fffbeb] text-[#b45309]",
  overdue: "bg-[#fef2f2] text-[#991b1b]",
  paid: "bg-[#ecfdf5] text-[#065f46]",
};

export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const created = (useLocation().state as { created?: Invoice } | null)
    ?.created;
  const invoice =
    invoices.find((item) => item.id === id) ??
    (created?.id === id ? created : undefined);
  const [status, setStatus] = useState<InvoiceStatus>(
    invoice?.status ?? "draft",
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialog, setDialog] = useState<"send" | "paid" | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: PointerEvent | KeyboardEvent) => {
      if (
        event instanceof KeyboardEvent
          ? event.key === "Escape"
          : !menuRef.current?.contains(event.target as Node)
      )
        setMenuOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [menuOpen]);

  if (!invoice) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-[#e5e8ed] bg-white p-10 text-center">
          <h1 className="text-lg font-semibold text-[#0f172a]">
            Invoice not found
          </h1>
          <p className="pt-1 text-sm text-[#64748b]">
            We couldn't find invoice {id}.
          </p>
          <Link
            to={BASE}
            className="mt-4 inline-block text-sm font-semibold text-[#c41e3a] hover:underline"
          >
            Back to Invoices
          </Link>
        </div>
      </div>
    );
  }

  const isDraft = status === "draft";
  const isPaid = status === "paid";
  const amountDue = isPaid ? 0 : invoice.amount;
  const customer = customerDetails[invoice.customer];

  const steps: { title: string; detail: string; state: StepState }[] = [
    {
      title: "Create invoice",
      detail: `Created ${formatDate(invoice.issued)} at 3:40 PM`,
      state: "done",
    },
    {
      title: "Send invoice",
      detail: isDraft
        ? "Not sent yet — approve the draft first"
        : `Sent to ${customer?.email ?? invoice.customer}`,
      state: isDraft ? "current" : "done",
    },
    {
      title: "Manage payments",
      detail: isPaid
        ? "Paid in full"
        : `Amount due: ${formatMoney(amountDue, true)}`,
      state: isPaid ? "done" : isDraft ? "upcoming" : "current",
    },
  ];

  const primary = isDraft
    ? { label: "Approve draft", onClick: () => setDialog("send") }
    : !isPaid
      ? { label: "Record payment", onClick: () => setDialog("paid") }
      : null;

  const menuItem =
    "flex w-full items-center gap-2.5 rounded-md py-2.25 pr-4 pl-3 text-left text-[13px] font-medium text-[#212633] hover:bg-[#f8fafc]";

  return (
    <>
      <SEO
        title={`Invoice ${invoice.id}`}
        description="Invoice details on ValorHub."
        robots="noindex, nofollow"
      />

      <div className="space-y-5 p-4 sm:p-6">
        <Link
          to={BASE}
          className="inline-flex items-center gap-1 text-[13px] font-medium text-[#8c949e] hover:text-[#212633]"
        >
          <ArrowLeft aria-hidden className="size-3.5" />
          Back to Invoices
        </Link>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <dl className="flex flex-wrap items-start gap-x-8 gap-y-3">
            <div className="space-y-1">
              <dt className="text-xs text-[#8c949e]">Status</dt>
              <dd
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-semibold",
                  pillStyles[status],
                )}
              >
                {invoiceStatuses[status].label}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs text-[#8c949e]">Customer</dt>
              <dd className="text-base font-bold text-[#212633]">
                {invoice.customer}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs text-[#8c949e]">Amount Due</dt>
              <dd className="text-base font-bold text-[#c41e3a]">
                {formatMoney(amountDue, true)}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs text-[#8c949e]">Due On</dt>
              <dd className="text-base font-bold text-[#212633]">
                {formatDate(invoice.due)}
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap items-center gap-2.5">
            {isDraft && (
              <Link
                to={`${BASE}/${invoice.id}/edit`}
                className="rounded-full border border-[#e5e8ed] bg-white px-4 py-2.25 text-[13px] font-medium text-[#212633] hover:bg-[#f8fafc]"
              >
                Edit draft
              </Link>
            )}
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-1 rounded-full border border-[#e5e8ed] bg-white px-4 py-2.25 text-[13px] font-medium text-[#212633] hover:bg-[#f8fafc]"
              >
                More actions
                <ChevronDown aria-hidden className="size-3" />
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute top-full left-0 z-20 mt-2 w-58 space-y-0.5 overflow-hidden rounded-[10px] border border-[#e5e8ed] bg-white p-1.5 shadow-[0_6px_18px_rgba(0,0,0,0.14)]"
                >
                  <button
                    type="button"
                    role="menuitem"
                    className={menuItem}
                    onClick={() =>
                      navigate(`${BASE}/new`, {
                        state: { duplicateOf: invoice.id },
                      })
                    }
                  >
                    <Copy aria-hidden className="size-4" />
                    Duplicate invoice
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className={menuItem}
                    onClick={() => {
                      setMenuOpen(false);
                      // The browser print dialog offers "Save as PDF"
                      window.print();
                    }}
                  >
                    <Download aria-hidden className="size-4" />
                    Download PDF
                  </button>
                  <div className="my-0.5 h-px bg-[#e5e8ed]" />
                  <button
                    type="button"
                    role="menuitem"
                    className={cn(menuItem, "text-[#c41e3a]")}
                    onClick={() => {
                      setMenuOpen(false);
                      if (
                        window.confirm(
                          `Delete ${isDraft ? "draft" : "invoice"} ${invoice.id}? This can't be undone.`,
                        )
                      )
                        navigate(BASE, { state: { deleted: invoice.id } });
                    }}
                  >
                    <Trash2 aria-hidden className="size-4" />
                    {isDraft ? "Delete draft" : "Delete invoice"}
                  </button>
                </div>
              )}
            </div>
            {primary && (
              <button
                type="button"
                onClick={primary.onClick}
                className="rounded-full bg-[#c41e3a] px-4.5 py-2.25 text-[13px] font-semibold text-white hover:bg-[#a51a31]"
              >
                {primary.label}
              </button>
            )}
          </div>
        </div>

        {isDraft && (
          <p
            role="status"
            className="rounded-lg border border-[#f2d98c] bg-[#fff7e0] px-4 py-3 text-[13px] text-[#8c660d]"
          >
            This is a DRAFT invoice. The customer cannot see it until you
            approve and send it.
          </p>
        )}

        <ol
          aria-label="Invoice progress"
          className="divide-y divide-[#e5e8ed] rounded-xl border border-[#e5e8ed] bg-white"
        >
          {steps.map((step) => (
            <li
              key={step.title}
              className="flex items-center gap-3.5 px-5 py-4"
            >
              <span
                className={cn(
                  "grid size-7.5 shrink-0 place-content-center rounded-full",
                  stepBadge[step.state],
                )}
              >
                {step.state === "done" ? (
                  <Check aria-hidden className="size-3.5" strokeWidth={3} />
                ) : step.state === "current" ? (
                  <Dot aria-hidden className="size-6" strokeWidth={6} />
                ) : (
                  <Circle aria-hidden className="size-2.5" strokeWidth={2.5} />
                )}
                <span className="sr-only">
                  {step.state === "done"
                    ? "Completed: "
                    : step.state === "current"
                      ? "Current step: "
                      : "Upcoming: "}
                </span>
              </span>
              <div>
                <p
                  className={cn(
                    "text-sm font-semibold",
                    step.state === "upcoming"
                      ? "text-[#a6abb2]"
                      : "text-[#212633]",
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-[#8c949e]">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <article
          aria-label={`Invoice ${invoice.id}`}
          className="mx-auto w-full max-w-225 space-y-8 rounded-xl border border-[#e5e8ed] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:p-10"
        >
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
            <div className="space-y-1">
              <p className="flex gap-1.5 text-lg font-bold">
                <span className="text-[#c41e3a]">VALOR</span>
                <span className="text-[#212633]">HUB</span>
              </p>
              <p className="text-sm font-semibold text-[#212633]">
                {contractor.business}
              </p>
              <p className="text-xs text-[#595e66]">{business.address}</p>
              <p className="text-xs break-all text-[#595e66]">
                {business.email} · {business.phone}
              </p>
            </div>
            <div className="space-y-1.5 sm:text-right">
              <h1 className="text-[22px] font-bold text-[#212633]">INVOICE</h1>
              <dl className="space-y-1.5 text-xs">
                {[
                  ["Invoice Number:", invoice.id],
                  ["Invoice Date:", formatDate(invoice.issued)],
                  ["Payment Due:", formatDate(invoice.due)],
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-4 sm:justify-end">
                    <dt className="text-[#8c949e]">{label}</dt>
                    <dd className="font-semibold text-[#212633]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#8c949e]">Bill To</p>
            <p className="text-sm font-semibold text-[#212633]">
              {invoice.customer}
            </p>
            {customer && (
              <>
                <p className="text-xs text-[#595e66]">{customer.address}</p>
                <p className="text-xs text-[#595e66]">{customer.email}</p>
              </>
            )}
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#e5e8ed]">
            <table className="w-full min-w-120 text-left">
              <thead className="bg-[#f2f5f7] text-xs font-semibold text-[#8c949e]">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Description
                  </th>
                  <th
                    scope="col"
                    className="w-20 px-4 py-3 text-center font-semibold"
                  >
                    Qty
                  </th>
                  <th
                    scope="col"
                    className="w-30 px-4 py-3 text-right font-semibold"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="w-30 px-4 py-3 text-right font-semibold text-[#212633]"
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="align-top text-[13px] text-[#212633]">
                <tr>
                  <td className="px-4 py-3">
                    {invoice.project}
                    {itemDescriptions[invoice.id] && (
                      <span className="block pt-0.5 text-[11px] text-[#8c949e]">
                        {itemDescriptions[invoice.id]}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">1</td>
                  <td className="px-4 py-3 text-right">
                    {formatMoney(invoice.amount, true)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {formatMoney(invoice.amount, true)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <dl className="ml-auto w-fit space-y-2 text-right">
            <div className="flex items-center justify-end gap-6 text-[13px]">
              <dt className="text-[#595e66]">Subtotal</dt>
              <dd className="font-bold text-[#212633]">
                {formatMoney(invoice.amount, true)}
              </dd>
            </div>
            {isPaid && (
              <div className="flex items-center justify-end gap-6 text-[13px]">
                <dt className="text-[#595e66]">Payments</dt>
                <dd className="font-bold text-[#268c59]">
                  −{formatMoney(invoice.amount, true)}
                </dd>
              </div>
            )}
            <div className="flex items-center justify-end gap-6">
              <dt className="text-sm font-semibold text-[#212633]">
                Amount Due (USD)
              </dt>
              <dd className="text-base font-bold text-[#c41e3a]">
                {formatMoney(amountDue, true)}
              </dd>
            </div>
          </dl>

          <p className="text-[11px] text-[#8c949e]">
            Thank you for your business. Payment due within 14 days.
          </p>
        </article>
      </div>
      {dialog === "send" && (
        <SendInvoiceModal
          invoice={invoice}
          onClose={() => setDialog(null)}
          onSend={() => {
            setStatus("pending");
            setDialog(null);
          }}
        />
      )}
      {dialog === "paid" && (
        <MarkPaidModal
          invoice={invoice}
          onClose={() => setDialog(null)}
          onConfirm={() => {
            setStatus("paid");
            setDialog(null);
          }}
        />
      )}
    </>
  );
}
