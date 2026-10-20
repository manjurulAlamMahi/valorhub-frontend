import { api } from "@/lib/api";

// GET /quotes/wizard-config
export type WizardConfig = {
  service_options: { key: string; name: string; icon: string }[];
  budget_options: { key: string; label: string }[];
  timeline_options: { key: string; label: string; description: string }[];
  target_contractor: {
    id: number;
    business_name: string;
    avatar: string | null;
  } | null;
  user_prefill: {
    name: string;
    email: string;
    city: string | null;
    state: string | null;
  } | null;
};

export type QuotePayload = {
  // The backend resolves the category from this name. Its option category_ids
  // don't match the categories table, so they are deliberately not sent.
  service_type: string;
  contractor_id?: number | null;
  description: string;
  budget_range: string;
  timeline: string;
  street_address: string | null;
  zip_code: string;
  city: string;
  state: string;
};

export const quotesApi = {
  create: (payload: QuotePayload) =>
    api.post<{ id: number; reference_number: string }>("/quotes", payload),
};
