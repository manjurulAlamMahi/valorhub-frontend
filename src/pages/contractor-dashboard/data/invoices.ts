import type { InvoiceStatus } from "@/services/contractor";

// Status pill styles for the API's invoice statuses
export const invoiceStatuses: Record<
  InvoiceStatus,
  { label: string; className: string }
> = {
  paid: { label: "Paid", className: "bg-[#ecfdf5] text-[#065f46]" },
  pending: { label: "Pending", className: "bg-[#fffbeb] text-[#b45309]" },
  overdue: { label: "Overdue", className: "bg-[#fef2f2] text-[#991b1b]" },
  draft: { label: "Draft", className: "bg-[#f1f5f9] text-[#64748b]" },
};

export const formatMoney = (value: number, cents = false) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

// Local YYYY-MM-DD; toISOString would shift the day for timezones east of UTC
export const toIsoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
