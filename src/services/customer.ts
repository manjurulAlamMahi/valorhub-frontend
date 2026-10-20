import { api, type Pagination } from "@/lib/api";
import type { ContractorBadgeFlags } from "./public";

export type QuoteStatus =
  | "new"
  | "pending"
  | "quoted"
  | "accepted"
  | "declined"
  | "rejected"
  | "expired";

export type InvoiceStatus = "draft" | "pending" | "paid" | "overdue";

type Paged<T> = { items: T[]; pagination: Pagination };

// QuoteRequestResource
export type ServiceRequest = {
  id: number;
  reference_number: string;
  project_title: string;
  service_type: string;
  budget: { display: string };
  timeline: { display: string };
  location: { display: string };
  recipient: { id: number; business_name: string } | null;
  status: QuoteStatus;
  requested_at: string | null;
};

// CustomerQuoteResource
export type CustomerQuote = {
  id: number;
  reference_number: string;
  project_title: string;
  service_type: string;
  description: string;
  status: QuoteStatus;
  contractor: {
    id: number | null;
    business_name: string;
    avatar: string | null;
    rating: number;
    review_count: number;
    location: string;
  };
  financials: {
    labor_cost_display: string;
    materials_cost_display: string;
    tax_cost_display: string;
    total_amount: number;
    total_amount_display: string;
  };
  estimated_duration: string;
  contractor_notes: string;
  requested_at: string | null;
};

// CustomerInvoiceResource
export type CustomerInvoice = {
  id: number;
  invoice_number: string;
  amount_display: string;
  status: InvoiceStatus;
  issued_at: string | null;
  due_at: string | null;
  paid_at: string | null;
  notes: string;
  breakdown: {
    labor_amount_display: string;
    materials_amount_display: string;
    platform_fee_display: string;
    total_due_display: string;
  };
  contractor: { id: number | null; business_name: string };
  project: { id: number; title: string; status: string } | null;
};

// CustomerPaymentResource
export type CustomerPayment = {
  id: number;
  transaction_id: string;
  invoice_number: string;
  amount_display: string;
  payment_method: string;
  status: string;
  contractor: { business_name: string };
  paid_at: string | null;
};

export type CustomerDashboard = {
  metrics: {
    active_requests: number;
    pending_quotes: number;
    completed_jobs: number;
    total_spent_display: string;
  };
  recent_requests: ServiceRequest[];
};

// SavedContractorResource
export type SavedContractor = {
  id: number;
  contractor_id: number;
  business_name: string;
  avatar: string | null;
  category: string;
  hourly_rate: number;
  rate_display: string;
  badges: ContractorBadgeFlags;
  location: string;
  rating: number;
  review_count: number;
  services: string[];
};

export type ReviewBusiness = {
  id: number;
  name: string;
  avatar: string | null;
};

export type CustomerReviews = {
  awaiting_feedback: {
    project_id: number;
    project_title: string;
    business: ReviewBusiness | null;
    completed_at: string | null;
  }[];
  past_reviews: {
    id: number;
    rating: number;
    comment: string | null;
    date: string | null;
    business: ReviewBusiness | null;
    project: { id: number; title: string } | null;
    contractor_reply: string | null;
    replied_at: string | null;
  }[];
};

// NotificationResource
export type AppNotification = {
  id: number;
  type: string;
  title: string;
  body: string;
  // e.g. conversation_id, invoice_id, quote_request_id
  data: Record<string, unknown>;
  is_read: boolean;
  relative_time: string | null;
};

export type AccountSettings = {
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  notification_preferences: Record<string, boolean>;
};

// ConversationListItemResource
export type ConversationSummary = {
  id: number;
  other_user: { id: number | null; name: string; avatar: string | null };
  linked_subject: { type: string; id: number; title: string } | null;
  last_message: {
    body: string;
    is_sender_me: boolean;
    sent_human: string;
  } | null;
  unread_count: number;
};

// MessageResource
export type ChatMessage = {
  id: number;
  is_sender_me: boolean;
  body: string;
  sent_time: string;
  sent_date: string;
};

// ConversationDetailResource
export type ConversationDetail = {
  id: number;
  other_user: {
    id: number | null;
    name: string;
    phone: string | null;
    location: string;
  };
  linked_project: { id: number; title: string } | null;
  linked_quote: { id: number; project_title: string | null } | null;
  messages: ChatMessage[];
};

export const customerApi = {
  acceptQuote: (id: number) =>
    api.post<CustomerQuote>(`/customer/quotes/${id}/accept`),
  declineQuote: (id: number) =>
    api.post<CustomerQuote>(`/customer/quotes/${id}/decline`),
  // Backend stub: marks the invoice paid and records a payment (no Stripe yet)
  payInvoice: (id: number) =>
    api.post<CustomerInvoice>(`/customer/invoices/${id}/pay`, {
      payment_method: "Credit Card",
    }),
  toggleSaved: (contractorId: number) =>
    api.post<{ is_saved: boolean }>(
      `/customer/saved-contractors/${contractorId}/toggle`,
    ),
  removeSaved: (contractorId: number) =>
    api.delete(`/customer/saved-contractors/${contractorId}`),
  savedContractors: (page: number) =>
    api.get<Paged<SavedContractor>>("/customer/saved-contractors", { page }),
  createReview: (payload: {
    project_id: number;
    rating: number;
    comment: string;
  }) => api.post("/customer/reviews", payload),
  markNotificationRead: (id: number) => api.post(`/notifications/${id}/read`),
  markAllNotificationsRead: () => api.post("/notifications/mark-all-read"),
  clearNotifications: () => api.delete("/notifications"),
  updateSettings: (payload: Partial<AccountSettings>) =>
    api.put<AccountSettings>("/account/settings", payload),
  changePassword: (payload: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) => api.put("/account/password", payload),
  sendMessage: (conversationId: number, body: string) =>
    api.post<ChatMessage>(`/messages/${conversationId}`, { body }),
};

export type { Paged };
