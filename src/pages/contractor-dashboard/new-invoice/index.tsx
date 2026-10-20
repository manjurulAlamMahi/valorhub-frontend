import { SEO } from "@/components/seo/SEO";
import PageLoader from "@/components/shared/page-loader";
import { ErrorState } from "@/components/shared/query-state";
import { useApi } from "@/hooks/use-api";
import { useAuth } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  invoiceApi,
  type ContractorInvoice,
  type InvoiceCustomer,
} from "@/services/contractor";
import type { ContractorProfileDetail } from "@/services/onboarding";
import { ChevronDown, Lock, Plus, Trash2, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router";
import { formatDate, formatMoney, toIsoDate } from "../data/invoices";
import AddCustomerModal from "./add-customer-modal";

type Item = { id: string; name: string; quantity: string; price: string };

const BASE = "/contractor/dashboard/invoices";
const terms = [
  { label: "On Receipt", days: 0 },
  { label: "Net 15", days: 15 },
  { label: "Net 30", days: 30 },
  { label: "Net 60", days: 60 },
];
const today = toIsoDate(new Date());

const addDays = (iso: string, days: number) => {
  const date = new Date(`${iso}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
};
// The API returns display dates ("Oct 20, 2026")
const fromDisplay = (value: string | null) =>
  value ? toIsoDate(new Date(value)) : today;
const daysBetween = (from: string, to: string) =>
  Math.round(
    (new Date(`${to}T00:00:00`).getTime() -
      new Date(`${from}T00:00:00`).getTime()) /
      86_400_000,
  );
const toNumber = (value: string) => Math.max(0, Number(value) || 0);
const newItem = (): Item => ({
  id: crypto.randomUUID(),
  name: "",
  quantity: "1",
  price: "",
});

const field =
  "w-full rounded-md border border-[#e5e8ed] bg-white px-2.5 py-1.75 text-xs font-medium text-[#212633] outline-none focus:border-[#262262]/40 focus:ring-3 focus:ring-[#262262]/10";
const sectionCard = "rounded-lg border border-[#e5e8ed] bg-white";

function MetaRow({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label
        htmlFor={htmlFor}
        className="w-27.5 shrink-0 text-xs text-[#8c949e]"
      >
        {label}
      </label>
      <div className="w-50 max-w-full">{children}</div>
    </div>
  );
}

// /invoices/new creates; /invoices/:id/edit edits a draft
export default function NewInvoice() {
  const { id } = useParams();
  const editing = id !== undefined;
  const query = useApi<ContractorInvoice>(
    editing && /^\d+$/.test(id) ? `/contractor/invoices/${id}` : null,
  );

  if (!editing) return <InvoiceForm />;
  if (query.error) {
    return (
      <div className="p-6">
        <ErrorState error={query.error} onRetry={query.refetch} />
      </div>
    );
  }
  if (!query.data) return <PageLoader />;
  // Only drafts can be edited; anything else goes back to the invoice
  if (!query.data.is_editable) return <Navigate to={`${BASE}/${id}`} replace />;
  return <InvoiceForm key={query.data.id} invoice={query.data} />;
}

function InvoiceForm({ invoice }: { invoice?: ContractorInvoice }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const profile = useApi<ContractorProfileDetail>("/contractor/profile");
  const [businessOpen, setBusinessOpen] = useState(false);

  const initialIssued = fromDisplay(invoice?.issued_at ?? null);
  const initialTerm = invoice
    ? daysBetween(initialIssued, fromDisplay(invoice.due_at))
    : 0;
  const [customer, setCustomer] = useState<InvoiceCustomer | null>(() =>
    invoice?.customer.id
      ? {
          id: invoice.customer.id,
          name: invoice.customer.name,
          email: invoice.customer.email ?? "",
          phone: invoice.customer.phone,
          billing_address: invoice.bill_to_address,
        }
      : null,
  );
  const [customerOpen, setCustomerOpen] = useState(false);
  const [issued, setIssued] = useState(initialIssued);
  const [termDays, setTermDays] = useState(Math.max(0, initialTerm));
  const [items, setItems] = useState<Item[]>(() =>
    invoice
      ? invoice.items.map((item) => ({
          id: crypto.randomUUID(),
          name: item.name,
          quantity: String(item.quantity),
          price: String(item.price),
        }))
      : [newItem()],
  );
  const [notes, setNotes] = useState(invoice?.notes ?? "");
  const [errors, setErrors] = useState<{ customer?: string; items?: string }>(
    {},
  );
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [menuOpen, setMenuOpen] = useState<"top" | "bottom" | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const closeCustomer = useCallback(() => setCustomerOpen(false), []);

  // Keep a non-standard term from an edited draft selectable
  const termOptions = terms.some((term) => term.days === termDays)
    ? terms
    : [...terms, { label: `Net ${termDays}`, days: termDays }];
  const due = addDays(issued || today, termDays);
  const lines = items.filter((item) => item.name.trim());
  const total = items.reduce(
    (sum, item) => sum + toNumber(item.quantity) * toNumber(item.price),
    0,
  );

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: PointerEvent | KeyboardEvent) => {
      if (
        event instanceof KeyboardEvent
          ? event.key === "Escape"
          : !menuRef.current?.contains(event.target as Node)
      )
        setMenuOpen(null);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [menuOpen]);

  const updateItem = (itemId: string, patch: Partial<Item>) =>
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
    );

  const addItem = () => {
    setItems((prev) => [...prev, newItem()]);
    setErrors((prev) => ({ ...prev, items: undefined }));
  };

  // send = issue to the customer now (pending); otherwise keep as a draft
  const save = async (send: boolean) => {
    setMenuOpen(null);
    const next: typeof errors = {};
    if (!customer) next.customer = "Add a customer to this invoice.";
    if (!lines.length || lines.some((item) => toNumber(item.quantity) <= 0))
      next.items = "Add at least one item with a name and quantity.";
    else if (total < 1) next.items = "The invoice total must be at least $1.";
    setErrors(next);
    setFormError("");
    if (Object.keys(next).length) {
      document
        .getElementById(next.customer ? "customer-box" : "items-table")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const payload = {
      customer_id: customer!.id,
      items: lines.map((item) => ({
        name: item.name.trim(),
        quantity: toNumber(item.quantity),
        price: toNumber(item.price),
      })),
      bill_to_address: customer!.billing_address || null,
      issued_at: issued || today,
      due_at: due,
      notes: notes.trim() || null,
    };

    setSaving(true);
    try {
      const { data } = invoice
        ? await invoiceApi.update(invoice.id, payload)
        : await invoiceApi.create({ ...payload, send_immediately: send });
      navigate(`${BASE}/${data.id}`);
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? (Object.values(err.fieldErrors)[0]?.[0] ?? err.message)
          : "Could not save the invoice.",
      );
      setSaving(false);
    }
  };

  const actions = (position: "top" | "bottom") => (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        onClick={() => setPreview(true)}
        className="rounded-full border border-[#e5e8ed] bg-white px-4.5 py-2.25 text-[13px] font-medium text-[#212633] hover:bg-[#f8fafc]"
      >
        Preview
      </button>
      {invoice ? (
        <button
          type="button"
          disabled={saving}
          onClick={() => void save(false)}
          className="rounded-full bg-[#c41e3a] px-4.5 py-2.25 text-[13px] font-semibold text-white hover:bg-[#a51a31] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      ) : (
        <div
          ref={menuOpen === position ? menuRef : undefined}
          className="relative flex"
        >
          <button
            type="button"
            disabled={saving}
            onClick={() => void save(true)}
            className="rounded-l-full bg-[#c41e3a] py-2.25 pr-2 pl-4.5 text-[13px] font-semibold text-white hover:bg-[#a51a31] disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save and send"}
          </button>
          <button
            type="button"
            aria-label="More save options"
            aria-expanded={menuOpen === position}
            disabled={saving}
            onClick={() => setMenuOpen(menuOpen === position ? null : position)}
            className="rounded-r-full bg-[#c41e3a] pr-3.5 pl-1.5 text-white hover:bg-[#a51a31] disabled:opacity-60"
          >
            <ChevronDown aria-hidden className="size-3.5" />
          </button>
          {menuOpen === position && (
            <div
              className={cn(
                "absolute right-0 z-20 w-44 overflow-hidden rounded-lg border border-[#e5e8ed] bg-white py-1 shadow-lg",
                position === "top" ? "top-full mt-2" : "bottom-full mb-2",
              )}
            >
              <button
                type="button"
                onClick={() => void save(false)}
                className="block w-full px-3.5 py-2 text-left text-[13px] text-[#212633] hover:bg-[#f8fafc]"
              >
                Save as draft
              </button>
              <button
                type="button"
                onClick={() => void save(true)}
                className="block w-full px-3.5 py-2 text-left text-[13px] text-[#212633] hover:bg-[#f8fafc]"
              >
                Save and send
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const business = profile.data?.business_info;
  const businessLines = [
    business?.address ??
      [business?.city, business?.state].filter(Boolean).join(", "),
    user?.email,
    business?.phone_number,
  ].filter(Boolean);

  return (
    <>
      <SEO
        title={invoice ? `Edit ${invoice.invoice_number}` : "New Invoice"}
        description="Create a new invoice on ValorHub."
        robots="noindex, nofollow"
      />

      <div className="space-y-4 p-4 sm:p-6">
        <section className={sectionCard}>
          <button
            type="button"
            onClick={() => setBusinessOpen((prev) => !prev)}
            aria-expanded={businessOpen}
            className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-[13px] font-medium text-[#212633]"
          >
            Business name, address and contact details
            <ChevronDown
              aria-hidden
              className={cn(
                "size-4 shrink-0 text-[#8c949e] transition-transform",
                {
                  "rotate-180": businessOpen,
                },
              )}
            />
          </button>
          {businessOpen && (
            <div className="space-y-2 border-t border-[#e5e8ed] px-4 pt-3 pb-4 text-[13px]">
              <p className="font-semibold text-[#212633]">
                {business?.business_name ?? user?.business?.business_name}
              </p>
              {businessLines.map((line) => (
                <p key={line} className="text-xs text-[#595e66]">
                  {line}
                </p>
              ))}
              {/* These details come from the business profile and print on every invoice */}
              <Link
                to="/contractor/dashboard/profile"
                className="inline-block pt-1 text-xs font-semibold text-[#c41e3a] hover:underline"
              >
                Edit in Business Profile
              </Link>
            </div>
          )}
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-[#212633]">
            {invoice ? `Edit draft ${invoice.invoice_number}` : "New invoice"}
          </h1>
          {actions("top")}
        </div>

        {formError && (
          <p
            role="alert"
            className="rounded-lg bg-[#fef2f2] px-4 py-3 text-sm text-[#c41e3a]"
          >
            {formError}
          </p>
        )}

        <section className="space-y-6 rounded-xl border border-[#e5e8ed] bg-white p-4 sm:p-6">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            <div
              id="customer-box"
              className={cn(
                "flex min-h-45 flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-[#ccd1d9] p-4",
                { "border-[#c41e3a]": errors.customer },
              )}
            >
              {customer ? (
                <div className="w-full max-w-sm space-y-1 text-left">
                  <p className="text-xs text-[#8c949e]">Bill to</p>
                  <p className="text-sm font-semibold text-[#212633]">
                    {customer.name}
                  </p>
                  {[customer.email, customer.phone, customer.billing_address]
                    .filter(Boolean)
                    .map((line) => (
                      <p key={line} className="text-xs text-[#595e66]">
                        {line}
                      </p>
                    ))}
                  <button
                    type="button"
                    onClick={() => setCustomerOpen(true)}
                    className="pt-1 text-xs font-semibold text-[#c41e3a] hover:underline"
                  >
                    Change customer
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setCustomerOpen(true)}
                  className="flex items-center gap-2 text-sm font-semibold text-[#c41e3a] hover:underline"
                >
                  <Plus aria-hidden className="size-4" />
                  Add a customer
                </button>
              )}
              {errors.customer && (
                <p className="pt-2 text-xs text-[#c41e3a]">{errors.customer}</p>
              )}
            </div>

            <div className="w-full space-y-3.5 lg:w-85">
              <MetaRow label="Invoice number">
                <div className="flex flex-col gap-0.5 rounded-md border border-[#e0e3e8] bg-[#f5f6f9] px-2.5 py-1.75">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-[#666b75]">
                    <Lock aria-hidden className="size-2.5 text-[#c9a227]" />
                    {invoice?.invoice_number ?? "Assigned on save"}
                  </span>
                  <span className="text-[10px] text-[#8c949e]">
                    Auto-generated
                  </span>
                </div>
              </MetaRow>
              <MetaRow label="Invoice date" htmlFor="invoice-date">
                <input
                  id="invoice-date"
                  type="date"
                  value={issued}
                  onChange={(event) => setIssued(event.target.value)}
                  className={field}
                />
              </MetaRow>
              <MetaRow label="Payment due" htmlFor="payment-terms">
                <div className="relative flex flex-col gap-0.5 rounded-md border border-[#e5e8ed] px-2.5 py-1.75 focus-within:border-[#262262]/40">
                  <span className="text-xs font-medium text-[#212633]">
                    {formatDate(due)}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-[#8c949e]">
                    {termOptions.find((term) => term.days === termDays)?.label}
                    <ChevronDown aria-hidden className="size-2.5" />
                  </span>
                  <select
                    id="payment-terms"
                    value={termDays}
                    onChange={(event) =>
                      setTermDays(Number(event.target.value))
                    }
                    className="absolute inset-0 cursor-pointer opacity-0"
                  >
                    {termOptions.map((term) => (
                      <option key={term.label} value={term.days}>
                        {term.label}
                      </option>
                    ))}
                  </select>
                </div>
              </MetaRow>
            </div>
          </div>

          <div
            id="items-table"
            className={cn(
              "overflow-x-auto rounded-lg border border-[#e5e8ed]",
              {
                "border-[#c41e3a]": errors.items,
              },
            )}
          >
            <div className="min-w-160">
              <div className="grid grid-cols-[1fr_7rem_8rem_8rem_2rem] gap-3 bg-[#f2f5f7] px-4 py-2.5 text-xs font-semibold text-[#8c949e]">
                <span>Items</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Price</span>
                <span className="text-right">Amount</span>
                <span className="sr-only">Remove</span>
              </div>
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1fr_7rem_8rem_8rem_2rem] items-center gap-3 border-b border-[#e5e8ed] px-4 py-2.5"
                >
                  <input
                    aria-label={`Item ${index + 1} description`}
                    maxLength={255}
                    value={item.name}
                    onChange={(event) => {
                      updateItem(item.id, { name: event.target.value });
                      setErrors((prev) => ({ ...prev, items: undefined }));
                    }}
                    placeholder="Describe the item or service"
                    className={field}
                  />
                  <input
                    aria-label={`Item ${index + 1} quantity`}
                    type="number"
                    min="0.01"
                    step="any"
                    value={item.quantity}
                    onChange={(event) =>
                      updateItem(item.id, { quantity: event.target.value })
                    }
                    className={cn(field, "text-center")}
                  />
                  <input
                    aria-label={`Item ${index + 1} price`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(event) =>
                      updateItem(item.id, { price: event.target.value })
                    }
                    placeholder="0.00"
                    className={cn(field, "text-right")}
                  />
                  <span className="text-right text-[13px] font-semibold text-[#212633]">
                    {formatMoney(
                      toNumber(item.quantity) * toNumber(item.price),
                      true,
                    )}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove item ${index + 1}`}
                    disabled={items.length === 1}
                    onClick={() =>
                      setItems((prev) =>
                        prev.filter((entry) => entry.id !== item.id),
                      )
                    }
                    className="grid size-7 place-content-center rounded text-[#8c949e] hover:bg-[#fef2f2] hover:text-[#c41e3a] disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <Trash2 aria-hidden className="size-3.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addItem}
                className="flex w-full items-center gap-2 px-4 py-3.5 text-[13px] font-semibold text-[#c41e3a] hover:bg-[#fff5f6]"
              >
                <Plus aria-hidden className="size-4" />
                Add an item
              </button>
            </div>
          </div>
          {errors.items && (
            <p className="-mt-4 text-xs text-[#c41e3a]">{errors.items}</p>
          )}

          <dl className="ml-auto w-fit space-y-2.5 text-right">
            <div className="flex items-center justify-end gap-7.5 text-[#212633]">
              <dt className="text-sm font-semibold">Total (USD)</dt>
              <dd className="w-22.5 text-[15px] font-bold">
                {formatMoney(total, true)}
              </dd>
            </div>
            <div className="flex items-center justify-end gap-7.5 text-[#212633]">
              <dt className="text-sm font-semibold">Amount Due</dt>
              <dd className="w-22.5 text-[15px] font-bold">
                {formatMoney(total, true)}
              </dd>
            </div>
          </dl>

          <div className="space-y-2">
            <label
              htmlFor="invoice-notes"
              className="block text-[13px] font-semibold text-[#212633]"
            >
              Notes / Terms
            </label>
            <textarea
              id="invoice-notes"
              rows={2}
              maxLength={1000}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Enter notes or terms of service that are visible to your customer"
              className="h-15 min-h-15 w-full resize-y rounded-lg border border-[#e5e8ed] px-3.5 py-3 text-[13px] text-[#212633] outline-none placeholder:text-[#a6abb2] focus:border-[#262262]/40 focus:ring-3 focus:ring-[#262262]/10"
            />
          </div>
        </section>

        {actions("bottom")}
      </div>

      {preview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Invoice preview"
          className="fixed inset-0 z-60 grid place-items-center bg-[#0f172a]/50 p-4"
          onClick={() => setPreview(false)}
        >
          <div
            className="max-h-[90svh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#212633]">INVOICE</h2>
                <p className="text-sm font-semibold text-[#212633]">
                  {business?.business_name ?? user?.business?.business_name}
                </p>
                <p className="pt-2 text-xs whitespace-pre-line text-[#64748b]">
                  {businessLines.join("\n")}
                </p>
              </div>
              <button
                type="button"
                autoFocus
                aria-label="Close preview"
                onClick={() => setPreview(false)}
                className="rounded p-1 text-[#64748b] hover:bg-[#f1f5f9]"
              >
                <X aria-hidden className="size-5" />
              </button>
            </div>
            <div className="my-5 grid gap-4 border-y border-[#e5e8ed] py-4 text-xs sm:grid-cols-2">
              <div>
                <p className="text-[#8c949e]">Bill to</p>
                <p className="font-semibold text-[#212633]">
                  {customer?.name ?? "—"}
                </p>
                {customer?.billing_address && (
                  <p className="text-[#64748b]">{customer.billing_address}</p>
                )}
              </div>
              <div className="space-y-0.5 sm:text-right">
                <p>
                  <span className="text-[#8c949e]">Invoice #</span>{" "}
                  {invoice?.invoice_number ?? "Assigned on save"}
                </p>
                <p>
                  <span className="text-[#8c949e]">Date</span>{" "}
                  {formatDate(issued || today)}
                </p>
                <p>
                  <span className="text-[#8c949e]">Due</span> {formatDate(due)}
                </p>
              </div>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="text-[#8c949e]">
                <tr>
                  <th className="pb-2 font-semibold">Item</th>
                  <th className="pb-2 text-center font-semibold">Qty</th>
                  <th className="pb-2 text-right font-semibold">Price</th>
                  <th className="pb-2 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-[#e5e8ed] text-[#212633]"
                  >
                    <td className="py-2">{item.name}</td>
                    <td className="py-2 text-center">
                      {toNumber(item.quantity)}
                    </td>
                    <td className="py-2 text-right">
                      {formatMoney(toNumber(item.price), true)}
                    </td>
                    <td className="py-2 text-right">
                      {formatMoney(
                        toNumber(item.quantity) * toNumber(item.price),
                        true,
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 border-t border-[#e5e8ed] pt-3 text-right text-sm font-bold text-[#212633]">
              Amount Due {formatMoney(total, true)}
            </p>
            {notes && (
              <p className="pt-4 text-xs whitespace-pre-line text-[#64748b]">
                {notes}
              </p>
            )}
          </div>
        </div>
      )}
      {customerOpen && (
        <AddCustomerModal
          onClose={closeCustomer}
          onSelect={(selected) => {
            setCustomer(selected);
            setCustomerOpen(false);
            setErrors((prev) => ({ ...prev, customer: undefined }));
          }}
        />
      )}
    </>
  );
}
