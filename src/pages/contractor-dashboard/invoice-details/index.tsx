import { SEO } from "@/components/seo/SEO";
import QueryBoundary from "@/components/shared/query-boundary";
import { useApi } from "@/hooks/use-api";
import { useAuth } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { NotFound } from "@/pages/NotFound";
import {
  invoiceApi,
  type ContractorInvoice,
  type InvoiceStatus,
} from "@/services/contractor";
import type { ContractorProfileDetail } from "@/services/onboarding";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Circle,
  Copy,
  Dot,
  Download,
  Send,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import MarkPaidModal from "../_components/mark-paid-modal";
import SendInvoiceModal from "../_components/send-invoice-modal";
import { formatMoney, invoiceStatuses } from "../data/invoices";

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

const menuItem =
  "flex w-full items-center gap-2.5 rounded-md py-2.25 pr-4 pl-3 text-left text-[13px] font-medium text-[#212633] hover:bg-[#f8fafc] disabled:opacity-50";

export default function InvoiceDetails() {
  const { id } = useParams();
  const valid = /^\d+$/.test(id ?? "");
  const query = useApi<ContractorInvoice>(
    valid ? `/contractor/invoices/${id}` : null,
  );

  if (!valid || query.error?.status === 404) return <NotFound />;

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <Link
        to={BASE}
        className="inline-flex items-center gap-1 text-[13px] font-medium text-[#8c949e] hover:text-[#212633]"
      >
        <ArrowLeft aria-hidden className="size-3.5" />
        Back to Invoices
      </Link>
      <QueryBoundary query={query}>
        {(invoice) => (
          <InvoiceView
            key={invoice.id}
            invoice={invoice}
            onChange={query.refetch}
          />
        )}
      </QueryBoundary>
    </div>
  );
}

function InvoiceView({
  invoice,
  onChange,
}: {
  invoice: ContractorInvoice;
  onChange: () => void;
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  // The invoice header shows the business details from the contractor profile
  const profile = useApi<ContractorProfileDetail>("/contractor/profile");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialog, setDialog] = useState<"send" | "paid" | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const closeDialog = useCallback(() => setDialog(null), []);

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

  const run = async (label: string, task: () => Promise<void>) => {
    setMenuOpen(false);
    setBusy(label);
    setError("");
    try {
      await task();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  };

  const status = invoice.status;
  const isDraft = status === "draft";
  const isPaid = status === "paid";

  // First unfinished step is the current one
  const firstOpen = invoice.timeline.findIndex((step) => !step.done);
  const steps = invoice.timeline.map((step, index) => ({
    ...step,
    state: (step.done
      ? "done"
      : index === firstOpen
        ? "current"
        : "upcoming") as StepState,
  }));

  const primary = isDraft
    ? invoice.is_approved
      ? { label: "Send invoice", onClick: () => setDialog("send") }
      : {
          label: busy === "approve" ? "Approving…" : "Approve draft",
          onClick: () =>
            void run("approve", async () => {
              await invoiceApi.approve(invoice.id);
              onChange();
            }),
        }
    : !isPaid
      ? { label: "Record payment", onClick: () => setDialog("paid") }
      : null;

  const business = profile.data?.business_info;
  const businessAddress =
    business?.address ??
    [
      business?.city,
      [business?.state, business?.zip_code].filter(Boolean).join(" "),
    ]
      .filter(Boolean)
      .join(", ");

  return (
    <>
      <SEO
        title={`Invoice ${invoice.invoice_number}`}
        description="Invoice details on ValorHub."
        robots="noindex, nofollow"
      />

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
              {invoice.customer.name}
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-xs text-[#8c949e]">Amount Due</dt>
            <dd className="text-base font-bold text-[#c41e3a]">
              {formatMoney(invoice.amount_due, true)}
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-xs text-[#8c949e]">Due On</dt>
            <dd className="text-base font-bold text-[#212633]">
              {invoice.due_at}
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap items-center gap-2.5">
          {invoice.is_editable && (
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
                {!isDraft && !isPaid && (
                  <button
                    type="button"
                    role="menuitem"
                    className={menuItem}
                    onClick={() => {
                      setMenuOpen(false);
                      setDialog("send");
                    }}
                  >
                    <Send aria-hidden className="size-4" />
                    Resend invoice
                  </button>
                )}
                <button
                  type="button"
                  role="menuitem"
                  className={menuItem}
                  onClick={() =>
                    void run("duplicate", async () => {
                      const { data } = await invoiceApi.duplicate(invoice.id);
                      navigate(`${BASE}/${data.id}`);
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
                  onClick={() =>
                    void run("pdf", () => invoiceApi.downloadPdf(invoice))
                  }
                >
                  <Download aria-hidden className="size-4" />
                  Download PDF
                </button>
                {isDraft && (
                  <>
                    <div className="my-0.5 h-px bg-[#e5e8ed]" />
                    <button
                      type="button"
                      role="menuitem"
                      className={cn(menuItem, "text-[#c41e3a]")}
                      onClick={() => {
                        // Only drafts can be deleted
                        if (
                          window.confirm(
                            `Delete draft ${invoice.invoice_number}? This can't be undone.`,
                          )
                        )
                          void run("delete", async () => {
                            await invoiceApi.remove(invoice.id);
                            navigate(BASE);
                          });
                        else setMenuOpen(false);
                      }}
                    >
                      <Trash2 aria-hidden className="size-4" />
                      Delete draft
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          {primary && (
            <button
              type="button"
              disabled={busy !== null}
              onClick={primary.onClick}
              className="rounded-full bg-[#c41e3a] px-4.5 py-2.25 text-[13px] font-semibold text-white hover:bg-[#a51a31] disabled:opacity-60"
            >
              {primary.label}
            </button>
          )}
        </div>
      </div>

      {(error || busy === "pdf" || busy === "duplicate") && (
        <p
          role={error ? "alert" : "status"}
          className={cn("text-sm", error ? "text-[#c41e3a]" : "text-[#8c949e]")}
        >
          {error ||
            (busy === "pdf" ? "Preparing PDF…" : "Duplicating invoice…")}
        </p>
      )}

      {isDraft && (
        <p
          role="status"
          className="rounded-lg border border-[#f2d98c] bg-[#fff7e0] px-4 py-3 text-[13px] text-[#8c660d]"
        >
          This is a DRAFT invoice. The customer cannot see it until you approve
          and send it.
        </p>
      )}

      <ol
        aria-label="Invoice progress"
        className="divide-y divide-[#e5e8ed] rounded-xl border border-[#e5e8ed] bg-white"
      >
        {steps.map((step) => (
          <li key={step.step} className="flex items-center gap-3.5 px-5 py-4">
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
                {step.label}
              </p>
              <p className="text-xs text-[#8c949e]">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <article
        aria-label={`Invoice ${invoice.invoice_number}`}
        className="mx-auto w-full max-w-225 space-y-8 rounded-xl border border-[#e5e8ed] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:p-10"
      >
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <div className="space-y-1">
            <p className="flex gap-1.5 text-lg font-bold">
              <span className="text-[#c41e3a]">VALOR</span>
              <span className="text-[#212633]">HUB</span>
            </p>
            <p className="text-sm font-semibold text-[#212633]">
              {business?.business_name ?? user?.business?.business_name}
            </p>
            {businessAddress && (
              <p className="text-xs text-[#595e66]">{businessAddress}</p>
            )}
            <p className="text-xs break-all text-[#595e66]">
              {[user?.email, business?.phone_number]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <div className="space-y-1.5 sm:text-right">
            <h1 className="text-[22px] font-bold text-[#212633]">INVOICE</h1>
            <dl className="space-y-1.5 text-xs">
              {[
                ["Invoice Number:", invoice.invoice_number],
                ["Invoice Date:", invoice.issued_at],
                ["Payment Due:", invoice.due_at],
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
            {invoice.customer.name}
          </p>
          {invoice.bill_to_address && (
            <p className="text-xs text-[#595e66]">{invoice.bill_to_address}</p>
          )}
          {invoice.customer.email && (
            <p className="text-xs text-[#595e66]">{invoice.customer.email}</p>
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
              {invoice.items.map((item, index) => (
                <tr
                  key={index}
                  className="border-t border-[#e5e8ed] first:border-t-0"
                >
                  <td className="px-4 py-3">
                    {item.name}
                    {item.description && (
                      <span className="block pt-0.5 text-[11px] text-[#8c949e]">
                        {item.description}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">{item.quantity}</td>
                  <td className="px-4 py-3 text-right">
                    {formatMoney(item.price, true)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {formatMoney(item.amount, true)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <dl className="ml-auto w-fit space-y-2 text-right">
          <div className="flex items-center justify-end gap-6 text-[13px]">
            <dt className="text-[#595e66]">Subtotal</dt>
            <dd className="font-bold text-[#212633]">
              {formatMoney(invoice.subtotal, true)}
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
              {formatMoney(invoice.amount_due, true)}
            </dd>
          </div>
        </dl>

        <p className="text-[11px] whitespace-pre-line text-[#8c949e]">
          {invoice.notes || "Thank you for your business."}
        </p>
      </article>

      {dialog === "send" && (
        <SendInvoiceModal
          invoice={invoice}
          onClose={closeDialog}
          onSent={() => {
            setDialog(null);
            onChange();
          }}
        />
      )}
      {dialog === "paid" && (
        <MarkPaidModal
          invoice={invoice}
          onClose={closeDialog}
          onPaid={() => {
            setDialog(null);
            onChange();
          }}
        />
      )}
    </>
  );
}
