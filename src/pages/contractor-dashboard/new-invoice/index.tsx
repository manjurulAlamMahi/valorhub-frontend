import { SEO } from "@/components/seo/SEO";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  Lock,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { customers, type Customer } from "../data/customers";
import AddCustomerModal from "./add-customer-modal";
import { contractor } from "../data/contractor-dashboard";
import {
  business as businessContact,
  formatDate,
  formatMoney,
  invoices,
  type Invoice,
  type InvoiceStatus,
} from "../data/invoices";

type Item = { id: string; name: string; quantity: string; price: string };

const BASE = "/contractor/dashboard/invoices";
const terms = [
  { label: "On Receipt", days: 0 },
  { label: "Net 15", days: 15 },
  { label: "Net 30", days: 30 },
  { label: "Net 60", days: 60 },
];
// Local YYYY-MM-DD; toISOString would shift the day for timezones east of UTC
const toIso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const today = toIso(new Date());

const addDays = (iso: string, days: number) => {
  const date = new Date(`${iso}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toIso(date);
};
const toNumber = (value: string) => Math.max(0, Number(value) || 0);

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

function UpgradeTag() {
  return (
    <span className="rounded bg-[#c41e3a] px-2 py-0.75 text-[10px] font-semibold text-white">
      UPGRADE
    </span>
  );
}

export default function NewInvoice() {
  const navigate = useNavigate();
  const [number] = useState(() =>
    String(Math.floor(100000 + Math.random() * 900000)),
  );
  const [businessOpen, setBusinessOpen] = useState(false);
  const [business, setBusiness] = useState({
    name: contractor.business,
    title: "INVOICE",
    phone: businessContact.phone,
    email: businessContact.email,
    address: businessContact.address,
    summary: "Trusted veteran-owned roofing & repair",
    logo: "",
  });
  const [businessSaved, setBusinessSaved] = useState(false);
  // "Duplicate invoice" on the detail page pre-fills the form
  const duplicateOf = (useLocation().state as { duplicateOf?: string } | null)
    ?.duplicateOf;
  const source = invoices.find((invoice) => invoice.id === duplicateOf);
  const [customer, setCustomer] = useState<Customer | null>(() =>
    source
      ? (customers.find((item) => item.name === source.customer) ?? {
          name: source.customer,
          email: "",
        })
      : null,
  );
  const [customerOpen, setCustomerOpen] = useState(false);
  const [po, setPo] = useState("");
  const [issued, setIssued] = useState(today);
  const [termDays, setTermDays] = useState(0);
  const [items, setItems] = useState<Item[]>(() =>
    source
      ? [
          {
            id: "1",
            name: source.project,
            quantity: "1",
            price: String(source.amount),
          },
        ]
      : [],
  );
  const [discount, setDiscount] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [requireTerms, setRequireTerms] = useState(false);
  const [footerOpen, setFooterOpen] = useState(true);
  const [footer, setFooter] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagDraft, setTagDraft] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ customer?: string; items?: string }>(
    {},
  );
  const [preview, setPreview] = useState(false);
  const [menuOpen, setMenuOpen] = useState<"top" | "bottom" | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const due = addDays(issued || today, termDays);
  const subtotal = items.reduce(
    (total, item) => total + toNumber(item.quantity) * toNumber(item.price),
    0,
  );
  // Discount is a percentage of the subtotal
  const discountValue =
    Math.round(subtotal * Math.min(100, toNumber(discount ?? ""))) / 100;
  const total = subtotal - discountValue;

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

  const updateItem = (id: string, patch: Partial<Item>) =>
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", quantity: "1", price: "" },
    ]);
    setErrors((prev) => ({ ...prev, items: undefined }));
  };

  const addTag = () => {
    const tag = tagDraft.trim();
    if (tag && !tags.includes(tag)) setTags((prev) => [...prev, tag]);
    setTagDraft("");
  };

  const save = (status: InvoiceStatus) => {
    setMenuOpen(null);
    const next: typeof errors = {};
    if (!customer) next.customer = "Add a customer to this invoice.";
    if (!items.some((item) => item.name.trim() && toNumber(item.price) > 0))
      next.items = "Add at least one item with a price.";
    setErrors(next);
    if (Object.keys(next).length) {
      document
        .getElementById(next.customer ? "customer-box" : "items-table")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const invoice: Invoice = {
      id: `INV-${number}`,
      customer: customer!.name,
      project: items.find((item) => item.name.trim())!.name.trim(),
      amount: total,
      issued,
      due,
      status,
    };
    navigate(BASE, { state: { created: invoice } });
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
      <div
        ref={menuOpen === position ? menuRef : undefined}
        className="relative flex"
      >
        <button
          type="button"
          onClick={() => save("pending")}
          className="rounded-l-full bg-[#c41e3a] py-2.25 pr-2 pl-4.5 text-[13px] font-semibold text-white hover:bg-[#a51a31]"
        >
          Save and continue
        </button>
        <button
          type="button"
          aria-label="More save options"
          aria-expanded={menuOpen === position}
          onClick={() => setMenuOpen(menuOpen === position ? null : position)}
          className="rounded-r-full bg-[#c41e3a] pr-3.5 pl-1.5 text-white hover:bg-[#a51a31]"
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
              onClick={() => save("draft")}
              className="block w-full px-3.5 py-2 text-left text-[13px] text-[#212633] hover:bg-[#f8fafc]"
            >
              Save as draft
            </button>
            <button
              type="button"
              onClick={() => save("pending")}
              className="block w-full px-3.5 py-2 text-left text-[13px] text-[#212633] hover:bg-[#f8fafc]"
            >
              Save and send
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <SEO
        title="New Invoice"
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
            Business address and contact details, title, summary, and logo
            <ChevronDown
              aria-hidden
              className={cn(
                "size-4 shrink-0 text-[#8c949e] transition-transform",
                { "rotate-180": businessOpen },
              )}
            />
          </button>
          {businessOpen && (
            <div className="space-y-4 border-t border-[#e5e8ed] px-4 pt-1 pb-5">
              <div className="flex flex-col gap-5 pt-3 sm:flex-row">
                <label className="flex size-22.5 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-lg border border-dashed border-[#ccd1d9] bg-[#f7f9fa] text-[#a6abb2] focus-within:border-[#262262]/50 hover:border-[#262262]/40">
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        setBusiness((prev) => ({
                          ...prev,
                          logo: URL.createObjectURL(file),
                        }));
                        setBusinessSaved(false);
                      }
                      event.target.value = "";
                    }}
                    className="sr-only"
                  />
                  {business.logo ? (
                    <img
                      src={business.logo}
                      alt="Business logo"
                      className="size-full object-contain"
                    />
                  ) : (
                    <>
                      <Upload aria-hidden className="size-4" />
                      <span className="text-[10.5px]">Upload logo</span>
                    </>
                  )}
                </label>
                <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
                  {(
                    [
                      ["name", "Business name", "lg:col-span-3"],
                      ["title", "Invoice title", "lg:col-span-3"],
                      ["phone", "Phone", "lg:col-span-2"],
                      ["email", "Email", "lg:col-span-2"],
                      ["address", "Address", "sm:col-span-2 lg:col-span-2"],
                    ] as const
                  ).map(([key, label, span]) => (
                    <label key={key} className={cn("space-y-1.5", span)}>
                      <span className="block text-[11.5px] font-semibold text-[#8c949e]">
                        {label}
                      </span>
                      <input
                        value={business[key]}
                        onChange={(event) => {
                          setBusiness((prev) => ({
                            ...prev,
                            [key]: event.target.value,
                          }));
                          setBusinessSaved(false);
                        }}
                        className={cn(field, "py-2 text-[12.5px]")}
                      />
                    </label>
                  ))}
                </div>
              </div>
              <label className="block space-y-1.5">
                <span className="block text-[11.5px] font-semibold text-[#8c949e]">
                  Summary / tagline (shown under your business name)
                </span>
                <input
                  value={business.summary}
                  onChange={(event) => {
                    setBusiness((prev) => ({
                      ...prev,
                      summary: event.target.value,
                    }));
                    setBusinessSaved(false);
                  }}
                  className={cn(field, "py-2 text-[12.5px]")}
                />
              </label>
              <div className="flex items-center justify-end gap-3">
                {businessSaved && (
                  <p role="status" className="text-xs text-[#268c59]">
                    Business info saved
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setBusinessSaved(true)}
                  className="rounded-full bg-[#c41e3a] px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-[#a51a31]"
                >
                  Save business info
                </button>
              </div>
            </div>
          )}
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-[#212633]">New invoice</h1>
          {actions("top")}
        </div>

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
                  {[customer.email, customer.phone, customer.address]
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
                    {number}
                  </span>
                  <span className="text-[10px] text-[#8c949e]">
                    Auto-generated
                  </span>
                </div>
              </MetaRow>
              <MetaRow label="P.O./S.O. number" htmlFor="po-number">
                <input
                  id="po-number"
                  value={po}
                  onChange={(event) => setPo(event.target.value)}
                  className={field}
                />
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
                    {due}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-[#8c949e]">
                    {terms.find((term) => term.days === termDays)?.label}
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
                    {terms.map((term) => (
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
              { "border-[#c41e3a]": errors.items },
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
                    autoFocus={index === items.length - 1 && !item.name}
                    value={item.name}
                    onChange={(event) =>
                      updateItem(item.id, { name: event.target.value })
                    }
                    placeholder="Describe the item or service"
                    className={field}
                  />
                  <input
                    aria-label={`Item ${index + 1} quantity`}
                    type="number"
                    min="0"
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
                    onClick={() =>
                      setItems((prev) =>
                        prev.filter((entry) => entry.id !== item.id),
                      )
                    }
                    className="grid size-7 place-content-center rounded text-[#8c949e] hover:bg-[#fef2f2] hover:text-[#c41e3a]"
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
            <div className="flex items-center justify-end gap-7.5 text-[13px]">
              <dt className="text-[#8c949e]">Subtotal</dt>
              <dd className="w-22.5 font-bold text-[#212633]">
                {formatMoney(subtotal, true)}
              </dd>
            </div>
            <div className="flex items-center justify-end gap-7.5 text-[13px]">
              {discount === null ? (
                <dt>
                  <button
                    type="button"
                    onClick={() => setDiscount("")}
                    className="font-semibold text-[#c41e3a] hover:underline"
                  >
                    + Add a discount
                  </button>
                </dt>
              ) : (
                <dt className="flex items-center gap-2.5">
                  <label htmlFor="discount" className="text-[#8c949e]">
                    Discount
                  </label>
                  <input
                    id="discount"
                    autoFocus
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(event) => setDiscount(event.target.value)}
                    className="w-12 rounded-[5px] border border-[#e5e8ed] px-2 py-1 text-center text-[12.5px] font-medium text-[#212633] outline-none focus:border-[#262262]/40 focus:ring-3 focus:ring-[#262262]/10"
                  />
                  <span className="text-[12.5px] font-medium text-[#8c949e]">
                    %
                  </span>
                  <button
                    type="button"
                    aria-label="Remove discount"
                    onClick={() => setDiscount(null)}
                    className="text-[#8c949e] hover:text-[#c41e3a]"
                  >
                    <X aria-hidden className="size-3" />
                  </button>
                </dt>
              )}
              <dd className="w-22.5 font-bold text-[#268c59]">
                {discount !== null && discountValue > 0
                  ? `-${formatMoney(discountValue, true)}`
                  : ""}
              </dd>
            </div>
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
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Enter notes or terms of service that are visible to your customer"
              className="h-15 min-h-15 w-full resize-y rounded-lg border border-[#e5e8ed] px-3.5 py-3 text-[13px] text-[#212633] outline-none placeholder:text-[#a6abb2] focus:border-[#262262]/40 focus:ring-3 focus:ring-[#262262]/10"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              role="switch"
              aria-checked={requireTerms}
              aria-labelledby="require-terms-label"
              onClick={() => setRequireTerms((prev) => !prev)}
              className={cn(
                "relative h-4.5 w-8.5 shrink-0 rounded-full bg-[#e2e5ea] transition-colors",
                { "bg-[#262262]": requireTerms },
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 size-3.5 rounded-full bg-white shadow transition-transform",
                  { "translate-x-4": requireTerms },
                )}
              />
            </button>
            <div>
              <p id="require-terms-label" className="text-xs text-[#212633]">
                Require customer to agree to terms of service before paying by
                credit card
              </p>
              <Link
                to="/faq"
                className="text-[11px] font-medium text-[#c41e3a] hover:underline"
              >
                Learn more about how to protect yourself with terms of service
              </Link>
            </div>
          </div>
        </section>

        <section className={sectionCard}>
          <button
            type="button"
            onClick={() => setFooterOpen((prev) => !prev)}
            aria-expanded={footerOpen}
            className="flex w-full items-center justify-between px-4 py-3 text-[13px] font-semibold text-[#212633]"
          >
            Footer
            <ChevronUp
              aria-hidden
              className={cn("size-4 text-[#8c949e] transition-transform", {
                "rotate-180": !footerOpen,
              })}
            />
          </button>
          {footerOpen && (
            <div className="px-4 pt-1 pb-4">
              <label htmlFor="invoice-footer" className="sr-only">
                Footer
              </label>
              <textarea
                id="invoice-footer"
                rows={1}
                value={footer}
                onChange={(event) => setFooter(event.target.value)}
                placeholder="Enter a footer for this invoice (e.g. tax information, thank you note)"
                className="h-5 min-h-5 w-full resize-y text-[13px] leading-5 text-[#212633] outline-none placeholder:text-[#a6abb2]"
              />
            </div>
          )}
        </section>

        <section className={cn(sectionCard, "space-y-2.5 p-4")}>
          <div className="flex items-center gap-2">
            <label
              htmlFor="invoice-tags"
              className="text-[13px] font-semibold text-[#212633]"
            >
              Tags
            </label>
            <UpgradeTag />
          </div>
          <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-[#e5e8ed] px-3 py-1.5 focus-within:border-[#262262]/40">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full bg-[#eeedf8] py-0.5 pr-1 pl-2.5 text-xs text-[#262262]"
              >
                {tag}
                <button
                  type="button"
                  aria-label={`Remove tag ${tag}`}
                  onClick={() =>
                    setTags((prev) => prev.filter((item) => item !== tag))
                  }
                  className="rounded-full p-0.5 hover:bg-[#262262]/10"
                >
                  <X aria-hidden className="size-3" />
                </button>
              </span>
            ))}
            <input
              id="invoice-tags"
              value={tagDraft}
              onChange={(event) => setTagDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === ",") {
                  event.preventDefault();
                  addTag();
                }
              }}
              onBlur={addTag}
              placeholder={tags.length ? "" : "Search or add a new tag"}
              className="min-w-30 flex-1 py-0.75 text-xs text-[#212633] outline-none placeholder:text-[#a6abb2]"
            />
          </div>
          <Link
            to="/faq"
            className="text-[11px] text-[#8c949e] hover:underline"
          >
            Learn more about tags and project-based accounting
          </Link>
        </section>

        <section className={cn(sectionCard, "space-y-3 p-4")}>
          <div className="flex items-center gap-2">
            <h2 className="text-[13px] font-semibold text-[#212633]">
              Attachments
            </h2>
            <span
              title="Attach files your customer can download with the invoice"
              className="cursor-help text-xs text-[#8c949e]"
            >
              ?
            </span>
            <UpgradeTag />
          </div>
          <label
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              setFiles((prev) => [
                ...new Set([
                  ...prev,
                  ...Array.from(event.dataTransfer.files, (file) => file.name),
                ]),
              ]);
            }}
            className="flex h-30 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#ccd1d9] bg-[#fafafc] text-center focus-within:border-[#262262]/50 hover:border-[#262262]/40"
          >
            <input
              type="file"
              multiple
              onChange={(event) => {
                const picked = Array.from(event.target.files ?? []);
                setFiles((prev) => [
                  ...new Set([
                    ...prev,
                    ...picked
                      .filter((file) => file.size <= 20 * 1024 * 1024)
                      .map((file) => file.name),
                  ]),
                ]);
                event.target.value = "";
              }}
              className="sr-only"
            />
            <Upload aria-hidden className="size-5.5 text-[#a6abb2]" />
            <span className="text-[13px] font-medium text-[#212633]">
              Drag files here or click to upload
            </span>
            <span className="text-[11px] text-[#8c949e]">Max 20MB</span>
          </label>
          {files.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {files.map((name) => (
                <li
                  key={name}
                  className="flex items-center gap-1 rounded-full bg-[#f1f5f9] py-1 pr-1.5 pl-3 text-xs text-[#212633]"
                >
                  {name}
                  <button
                    type="button"
                    aria-label={`Remove ${name}`}
                    onClick={() =>
                      setFiles((prev) => prev.filter((file) => file !== name))
                    }
                    className="rounded-full p-0.5 hover:bg-[#e2e8f0]"
                  >
                    <X aria-hidden className="size-3" />
                  </button>
                </li>
              ))}
            </ul>
          )}
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
                <h2 className="text-2xl font-bold text-[#212633]">
                  {business.title || "INVOICE"}
                </h2>
                <p className="text-sm font-semibold text-[#212633]">
                  {business.name}
                </p>
                {business.summary && (
                  <p className="text-sm text-[#64748b]">{business.summary}</p>
                )}
                <p className="pt-2 text-xs whitespace-pre-line text-[#64748b]">
                  {[business.address, business.email, business.phone]
                    .filter(Boolean)
                    .join("\n")}
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
              </div>
              <div className="space-y-0.5 sm:text-right">
                <p>
                  <span className="text-[#8c949e]">Invoice #</span> {number}
                </p>
                {po && (
                  <p>
                    <span className="text-[#8c949e]">P.O./S.O.</span> {po}
                  </p>
                )}
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
                {items
                  .filter((item) => item.name.trim())
                  .map((item) => (
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
            {footer && (
              <p className="pt-4 text-center text-[11px] text-[#8c949e]">
                {footer}
              </p>
            )}
          </div>
        </div>
      )}
      {customerOpen && (
        <AddCustomerModal
          onClose={() => setCustomerOpen(false)}
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
