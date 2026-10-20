import { api } from "@/lib/api";

// MembershipPlanResource
export type MembershipPlan = {
  id: number;
  name: string;
  slug: string;
  is_popular: boolean;
  monthly_price: number;
  annual_price: number | null;
  is_free: boolean;
  features: string[];
  limits: {
    service_limit: number | null;
    gallery_limit: number | null;
    video_limit: number | null;
  };
};

// BusinessOnboardingStatusResource
export type OnboardingStatus = {
  user_id: number;
  status: string;
  onboarding_step: number;
  onboarding_completed: boolean;
  membership: {
    plan_id: number | null;
    slug: string;
    is_free: boolean;
    status: string;
  };
  verification: { is_id_verified: boolean; is_veteran_owned: boolean };
  business_info: {
    business_name: string | null;
    owner_name: string | null;
    business_type: string | null;
    phone_number: string | null;
    city: string | null;
    state: string | null;
    zip_code: string | null;
  };
};

// BusinessOnboardingReviewResource (the parts the review screen shows)
export type OnboardingReview = {
  account: { owner_name: string; email: string };
  membership: { plan_name: string; display_price: string };
  verification: { is_id_verified: boolean; badge: string };
  business_info: { business_name: string | null; location: string };
  profile_details: { years_experience: number | null };
  services: { id: number; name: string; category: string | null }[];
};

// ContractorProfileDetailResource (GET /contractor/profile): used to resume a signup
export type ContractorProfileDetail = {
  id: number;
  business_info: {
    business_name: string | null;
    owner_name: string | null;
    business_type: string | null;
    phone_number: string | null;
    primary_category: { id: number; name: string } | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip_code: string | null;
  };
  professional_details: {
    bio: string | null;
    years_experience: number | null;
    license_number: string | null;
    insurance_company: string | null;
    insurance_policy_number: string | null;
    emergency_service: boolean;
    languages: string[];
  };
  verifications_and_badges: { is_available_today: boolean };
  documents: {
    license_document: string | null;
    license_status: string;
    logo_status: string;
    cover_photo_status: string;
  };
  social_links: Record<
    | "website_url"
    | "linkedin_url"
    | "facebook_url"
    | "instagram_url"
    | "twitter_url",
    string | null
  >;
};

export type AccountPayload = {
  email: string;
  password: string;
  password_confirmation: string;
  business_name: string;
  owner_name: string;
  phone_number: string;
  business_type: string;
  terms_accepted: boolean;
};

export type CheckoutPayload = {
  card_number: string;
  exp_month: number;
  exp_year: number;
  cvc: string;
};

export type ServiceInput = {
  category_id: number;
  name: string;
  pricing_type: "fixed" | "hourly" | "sqft" | "custom_quote";
  price: number;
};

// Fields on PUT /contractor/profile (signup uses it for what onboarding endpoints don't accept)
export type ProfileExtras = Partial<{
  business_name: string;
  years_experience: number | null;
  address: string | null;
  bio: string | null;
  primary_category_id: number | null;
  license_number: string | null;
  insurance_company: string | null;
  insurance_policy_number: string | null;
  emergency_service: boolean;
  languages: string[];
}>;

const base = "/business/onboarding";

export const onboardingApi = {
  plans: () => api.get<{ plans: MembershipPlan[] }>("/membership-plans"),
  status: () => api.get<OnboardingStatus>(`${base}/status`),
  account: (payload: AccountPayload) =>
    api.post<{ token: { access_token: string } }>(`${base}/account`, payload),
  selectPlan: (planId: number) =>
    api.post<{ requires_payment: boolean }>(`${base}/plan`, {
      plan_id: planId,
      billing_cycle: "monthly",
    }),
  // Backend stub: records last4 and activates the plan. Must move to Stripe Elements
  // (payment_method_id) before launch so raw card numbers never reach our API.
  checkout: (payload: CheckoutPayload) => api.post(`${base}/checkout`, payload),
  // Backend stub until the ID.me OAuth hand-off exists
  verifyIdMe: () =>
    api.post(`${base}/id-me`, { status: "verified", is_veteran: true }),
  businessInfo: (payload: {
    business_name: string;
    city: string;
    state: string;
    zip_code: string;
  }) => api.post(`${base}/business-info`, payload),
  profile: (payload: { bio: string | null; years_experience: number | null }) =>
    api.post(`${base}/profile`, payload),
  socialLinks: (payload: Record<string, string | null>) =>
    api.post(`${base}/social-links`, payload),
  services: (services: ServiceInput[]) =>
    api.post(`${base}/services`, { services }),
  review: () => api.get<OnboardingReview>(`${base}/review`),
  submit: () => api.post(`${base}/submit`),

  contractorProfile: () =>
    api.get<ContractorProfileDetail>("/contractor/profile"),
  updateProfile: (payload: ProfileExtras) =>
    api.put("/contractor/profile", payload),
  setAvailability: (available: boolean) =>
    api.post("/contractor/toggle-availability", {
      is_available_today: available,
    }),
  uploadMedia: (
    files: Partial<Record<"logo" | "cover_photo" | "license_document", File>>,
  ) => {
    const body = new FormData();
    for (const [field, file] of Object.entries(files)) {
      if (file) body.append(field, file);
    }
    return api.post("/contractor/profile/media", body);
  },
};
