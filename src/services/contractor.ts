import { api, apiDownload, type Pagination } from "@/lib/api";
import type { QuoteStatus } from "./customer";
import type { MembershipPlan } from "./onboarding";

export type ProjectStatus =
  "in_progress" | "scheduled" | "pending_materials" | "completed" | "cancelled";

// ContractorDashboardResource
export type ContractorOverview = {
  contractor: {
    business_name: string;
    owner_name: string;
    location: string;
    is_available_today: boolean;
    is_id_verified: boolean;
    is_veteran_owned: boolean;
    membership_tier: string;
    membership_slug: string;
  };
  metrics: {
    total_earnings_display: string;
    monthly_earnings_display: string;
    active_leads_count: number;
    active_projects_count: number;
    completed_projects_count: number;
    avg_rating: number;
    review_count: number;
  };
  recent_leads: {
    id: number;
    customer_name: string;
    project_title: string;
    category_name: string;
    location: string;
    budget_display: string;
    status: QuoteStatus;
    requested_human: string;
  }[];
  ongoing_projects: {
    id: number;
    title: string;
    customer_name: string;
    progress_percent: number;
    status: ProjectStatus;
    due_date: string | null;
  }[];
};

// ContractorLeadResource
export type Lead = {
  id: number;
  reference_number: string;
  project_title: string;
  category_name: string;
  description: string;
  budget: { display: string };
  timeline: string;
  location: { display: string };
  customer: {
    id: number | null;
    name: string;
    email: string | null;
    phone: string | null;
    avatar: string | null;
  };
  quote_response: {
    display_amount: string;
    labor_cost: number | null;
    materials_cost: number | null;
    tax_cost: number | null;
    estimated_duration: string | null;
    contractor_notes: string | null;
  } | null;
  status: QuoteStatus;
  status_label: string;
  has_responded: boolean;
  requested_human: string;
};

export type LeadsData = {
  counts: Record<"all" | "new" | "quoted" | "accepted" | "declined", number>;
  items: Lead[];
  pagination: Pagination;
};

// ContractorProjectResource
export type ContractorProject = {
  id: number;
  title: string;
  total_amount_display: string;
  progress_percent: number;
  status: ProjectStatus;
  status_label: string;
  due_date: string | null;
  customer: { id: number | null; name: string };
  invoices_summary: { pending_amount_display: string; invoices_count: number };
};

export type ProjectsData = {
  counts: Record<"all" | ProjectStatus, number>;
  items: ContractorProject[];
  pagination: Pagination;
};

// ContractorReviewResource
export type ContractorReview = {
  id: number;
  rating: number;
  comment: string | null;
  is_featured: boolean;
  contractor_reply: string | null;
  customer: { name: string; avatar: string | null };
  project: { title: string } | null;
  date_formatted: string | null;
};

export type ReviewsData = {
  rating_summary: { average_rating: number; total_reviews: number };
  items: ContractorReview[];
  pagination: Pagination;
};

export type SendQuotePayload = {
  quote_amount: number;
  labor_cost?: number | null;
  materials_cost?: number | null;
  tax_cost?: number | null;
  estimated_duration?: string | null;
  contractor_notes?: string | null;
};

// ─── Invoices ────────────────────────────────────────────────────────────────

export type InvoiceStatus = "draft" | "pending" | "paid" | "overdue";

export type InvoiceLine = {
  name: string;
  description: string | null;
  quantity: number;
  price: number;
  amount: number;
};

// ContractorInvoiceResource
export type ContractorInvoice = {
  id: number;
  invoice_number: string;
  amount: number;
  items: InvoiceLine[];
  subtotal: number;
  amount_due: number;
  bill_to_address: string | null;
  payment_method: string | null;
  is_approved: boolean;
  is_editable: boolean;
  timeline: { step: string; label: string; done: boolean; detail: string }[];
  notes: string | null;
  issued_at: string | null;
  due_at: string | null;
  paid_at: string | null;
  status: InvoiceStatus;
  status_label: string;
  customer: {
    id: number | null;
    name: string;
    email: string | null;
    phone: string | null;
  };
  project: { id: number; title: string } | null;
  created_at: string;
};

type Money = { amount: number; display: string };

export type InvoicesData = {
  summary: {
    total_outstanding: Money & { count: number; label: string };
    paid_this_month: Money;
    overdue: Money & { count: number; label: string };
    draft: Money & { count: number; label: string };
    average_days_to_get_paid: { display: string; label: string };
    available_for_payout: Money & { payouts_enabled: boolean };
  };
  counts: Record<"all" | InvoiceStatus, number>;
  items: ContractorInvoice[];
  pagination: Pagination;
};

export type InvoiceCustomer = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  billing_address: string | null;
};

export type InvoicePayload = {
  customer_id: number;
  items: { name: string; quantity: number; price: number }[];
  bill_to_address?: string | null;
  issued_at: string;
  due_at: string;
  notes?: string | null;
  send_immediately?: boolean;
};

export const paymentMethods = [
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "card", label: "Credit card" },
  { value: "check", label: "Check" },
  { value: "cash", label: "Cash" },
  { value: "other", label: "Other" },
] as const;

export type PaymentMethod = (typeof paymentMethods)[number]["value"];

const invoices = "/contractor/invoices";

export const invoiceApi = {
  create: (payload: InvoicePayload) =>
    api.post<ContractorInvoice>(invoices, payload),
  // Drafts only; any edit clears the approval
  update: (id: number, payload: Partial<InvoicePayload>) =>
    api.put<ContractorInvoice>(`${invoices}/${id}`, payload),
  approve: (id: number) =>
    api.post<ContractorInvoice>(`${invoices}/${id}/approve`),
  sendPreview: (id: number) =>
    api.get<{
      to: string;
      subject: string;
      message: string;
      attachment: string;
    }>(`${invoices}/${id}/send`),
  // Emails the invoice with its PDF; sending a draft approves and issues it
  send: (
    id: number,
    payload: { to: string; subject: string; message: string },
  ) => api.post<ContractorInvoice>(`${invoices}/${id}/send`, payload),
  markPaid: (
    id: number,
    payload: { payment_date: string; payment_method: PaymentMethod },
  ) => api.post<ContractorInvoice>(`${invoices}/${id}/mark-paid`, payload),
  duplicate: (id: number) =>
    api.post<ContractorInvoice>(`${invoices}/${id}/duplicate`),
  remove: (id: number) => api.delete(`${invoices}/${id}`),
  downloadPdf: (invoice: { id: number; invoice_number: string }) =>
    apiDownload(
      `${invoices}/${invoice.id}/pdf`,
      `${invoice.invoice_number}.pdf`,
    ),
  customers: (search: string) =>
    api.get<InvoiceCustomer[]>("/contractor/customers", { search, limit: 10 }),
  // Reuses an existing customer account with the same email
  addCustomer: (payload: {
    name: string;
    email: string;
    phone?: string | null;
    billing_address?: string | null;
  }) =>
    api.post<InvoiceCustomer & { is_existing: boolean }>(
      "/contractor/customers",
      payload,
    ),
};

// ─── Catalog & branding ──────────────────────────────────────────────────────

// Plan usage banner ("Elite Plan: Unlimited services. Currently using 6.")
export type PlanUsage = {
  plan: string | null;
  limit: number | null;
  is_unlimited: boolean;
  used: number;
  remaining: number | null;
  can_add_more: boolean;
};

export type PricingType = "fixed" | "hourly" | "sqft" | "custom_quote";

// ContractorServiceResource
export type ContractorService = {
  id: number;
  name: string;
  description: string | null;
  pricing_type: PricingType;
  price: number | null;
  unit: string | null;
  price_display: string;
  is_active: boolean;
  category: { id: number; name: string } | null;
};

// ContractorProductResource
export type ContractorProductItem = {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  price: number;
  unit: string | null;
  price_display: string;
  stock_quantity: number;
  in_stock: boolean;
  is_active: boolean;
  category: { id: number; name: string } | null;
};

export type ListingKind = "service" | "product";

export type ListingsData<T> = {
  usage: PlanUsage;
  categories: { id: number; name: string; count: number }[];
  items: T[];
};

// GalleryItemResource
export type GalleryPhoto = {
  id: number;
  image: string | null;
  caption: string | null;
  category: string;
  category_label: string;
};

export type GalleryData = {
  usage: PlanUsage;
  categories: { key: string; label: string; count: number }[];
  items: GalleryPhoto[];
};

export type BannerData = {
  is_available: boolean;
  banner_image: string | null;
  banner_headline: string | null;
  business_name: string | null;
  is_live: boolean;
};

export type WebsiteData = {
  is_live: boolean;
  slug: string;
  subdomain_display: string;
  custom_domain: string | null;
  can_use_custom_domain: boolean;
  can_customize_slug: boolean;
};

const listingPath = (kind: ListingKind) =>
  kind === "service" ? "/contractor/services" : "/contractor/products";

export const catalogApi = {
  // Products with an image go as multipart (the API client spoofs PUT for FormData)
  saveListing: (
    kind: ListingKind,
    id: number | null,
    body: object | FormData,
  ) =>
    id === null
      ? api.post(listingPath(kind), body)
      : api.put(`${listingPath(kind)}/${id}`, body),
  toggleListing: (kind: ListingKind, id: number) =>
    api.post(`${listingPath(kind)}/${id}/toggle-status`),
  deleteListing: (kind: ListingKind, id: number) =>
    api.delete(`${listingPath(kind)}/${id}`),

  uploadPhotos: (files: File[], category: string) => {
    const body = new FormData();
    files.forEach((file) => body.append("images[]", file));
    body.append("category", category);
    return api.post<GalleryPhoto[]>("/contractor/gallery", body);
  },
  updatePhoto: (
    id: number,
    payload: { caption?: string | null; category?: string },
  ) => api.put<GalleryPhoto>(`/contractor/gallery/${id}`, payload),
  deletePhoto: (id: number) => api.delete(`/contractor/gallery/${id}`),

  updateBanner: (payload: { image?: File; headline?: string | null }) => {
    const body = new FormData();
    if (payload.image) body.append("banner_image", payload.image);
    if (payload.headline !== undefined)
      body.append("banner_headline", payload.headline ?? "");
    return api.post<BannerData>("/contractor/banner", body);
  },
  deleteBanner: () => api.delete("/contractor/banner"),

  updateWebsite: (payload: { custom_domain?: string | null; slug?: string }) =>
    api.put<WebsiteData>("/contractor/website", payload),

  deleteProfileMedia: (field: "logo" | "cover_photo" | "license_document") =>
    api.delete(`/contractor/profile/media/${field}`),
};

// ─── Subscription ────────────────────────────────────────────────────────────

export type BillingCycle = "monthly" | "annual";

export type CurrentSubscription = {
  plan: { id: number; name: string; slug: string };
  status: string;
  billing_cycle: BillingCycle;
  price: number;
  renews_at: string | null;
  payment_method_last4: string | null;
  // e.g. "$49/month · Renews Nov 20, 2026 · Visa ending 4242"
  summary: string;
};

export type SubscriptionData = {
  current: CurrentSubscription | null;
  plans: (MembershipPlan & { is_current: boolean })[];
  billing_history: {
    id: number;
    date: string | null;
    plan: string;
    amount_display: string;
    status: string;
  }[];
};

export const subscriptionApi = {
  // Paid plans are charged immediately (simulated by the API until Stripe is connected)
  change: (planId: number, cycle: BillingCycle) =>
    api.post<CurrentSubscription>("/contractor/subscription/change", {
      plan_id: planId,
      billing_cycle: cycle,
    }),
  // Drops back to the free plan
  cancel: () =>
    api.post<CurrentSubscription>("/contractor/subscription/cancel"),
  downloadReceipt: (id: number, date: string | null) =>
    apiDownload(
      `/contractor/subscription/billing/${id}/receipt`,
      `valorhub-receipt-${(date ?? String(id)).replace(/[ ,]+/g, "-").toLowerCase()}.pdf`,
    ),
};

export const contractorApi = {
  sendQuote: (id: number, payload: SendQuotePayload) =>
    api.post<Lead>(`/contractor/leads/${id}/send-quote`, payload),
  declineLead: (id: number) => api.post(`/contractor/leads/${id}/decline`),
  updateProgress: (
    id: number,
    payload: { progress_percent: number; status: ProjectStatus },
  ) =>
    api.put<ContractorProject>(`/contractor/projects/${id}/progress`, payload),
  replyToReview: (id: number, reply: string) =>
    api.post(`/contractor/reviews/${id}/reply`, { contractor_reply: reply }),
  toggleFeatured: (id: number) =>
    api.post(`/contractor/reviews/${id}/toggle-feature`),
  setAvailability: (available: boolean) =>
    api.post<{ is_available_today: boolean }>(
      "/contractor/toggle-availability",
      {
        is_available_today: available,
      },
    ),
  // Opens (or reuses) the conversation with a customer
  startConversation: (customerId: number, quoteRequestId?: number) =>
    api.post<{ id: number }>("/messages/start", {
      recipient_id: customerId,
      quote_request_id: quoteRequestId ?? null,
    }),
};
