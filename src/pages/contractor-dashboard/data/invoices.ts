export type InvoiceStatus = "paid" | "pending" | "overdue" | "draft";

export type Invoice = {
  id: string;
  customer: string;
  project: string;
  amount: number;
  // ISO dates so they can be filtered and sorted
  issued: string;
  due: string;
  status: InvoiceStatus;
};

export const invoiceStatuses: Record<
  InvoiceStatus,
  { label: string; className: string }
> = {
  paid: { label: "Paid", className: "bg-[#ecfdf5] text-[#065f46]" },
  pending: { label: "Pending", className: "bg-[#fffbeb] text-[#b45309]" },
  overdue: { label: "Overdue", className: "bg-[#fef2f2] text-[#991b1b]" },
  draft: { label: "Draft", className: "bg-[#f1f5f9] text-[#64748b]" },
};

export const invoices: Invoice[] = [
  {
    id: "INV-2041",
    customer: "Robert Henderson",
    project: "Kitchen Remodel",
    amount: 7500,
    issued: "2026-07-28",
    due: "2026-08-20",
    status: "pending",
  },
  {
    id: "INV-2040",
    customer: "Tanya Williams",
    project: "Deck Installation",
    amount: 3200,
    issued: "2026-07-25",
    due: "2026-08-05",
    status: "pending",
  },
  {
    id: "INV-2039",
    customer: "Patricia Nguyen",
    project: "Fence Installation",
    amount: 3800,
    issued: "2026-07-08",
    due: "2026-07-20",
    status: "paid",
  },
  {
    id: "INV-2038",
    customer: "Greg Simmons",
    project: "HVAC Replacement",
    amount: 8700,
    issued: "2026-06-18",
    due: "2026-07-01",
    status: "paid",
  },
  {
    id: "INV-2037",
    customer: "Lisa Chen",
    project: "Bathroom Renovation",
    amount: 4500,
    issued: "2026-07-15",
    due: "2026-07-28",
    status: "overdue",
  },
  {
    id: "INV-2036",
    customer: "Emily Patel",
    project: "Master Bath Remodel",
    amount: 9200,
    issued: "2026-06-01",
    due: "2026-06-15",
    status: "paid",
  },
  {
    id: "INV-2035",
    customer: "Brian Collins",
    project: "Roof Repair",
    amount: 4100,
    issued: "2026-07-28",
    due: "2026-08-10",
    status: "draft",
  },
];

export const business = {
  address: "1420 Ranch Rd, Kyle, TX 78640",
  email: "marcus@ironridgecontracting.com",
  phone: "(512) 555-0148",
};

// Billing details shown on the invoice document
export const customerDetails: Record<
  string,
  { address: string; email: string }
> = {
  "Robert Henderson": {
    address: "4512 Oak Hollow Dr, Austin, TX 78745",
    email: "robert.henderson@email.com",
  },
  "Tanya Williams": {
    address: "88 Park Ave, Austin, TX 78701",
    email: "tanya.williams@email.com",
  },
  "Patricia Nguyen": {
    address: "1902 Ridge Line Ct, Pflugerville, TX 78660",
    email: "patricia.nguyen@email.com",
  },
  "Greg Simmons": {
    address: "6610 Bluebonnet Ln, Buda, TX 78610",
    email: "greg.simmons@email.com",
  },
  "Lisa Chen": {
    address: "305 Cedar Park Blvd, Cedar Park, TX 78613",
    email: "lisa.chen@email.com",
  },
  "Emily Patel": {
    address: "77 Lakeview Ter, Round Rock, TX 78664",
    email: "emily.patel@email.com",
  },
  "Brian Collins": {
    address: "218 Maple Grove Ln, Kyle, TX 78640",
    email: "brian.collins@email.com",
  },
};

export const itemDescriptions: Record<string, string> = {
  "INV-2035": "Shingle replacement, flashing repair, and gutter reattachment",
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

export const plural = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? "" : "s"}`;
