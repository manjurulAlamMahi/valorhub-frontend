import { api, type Pagination } from "@/lib/api";

// ─── Shared ──────────────────────────────────────────────────────────────────

export type PlatformMetrics = {
  verified_pros_display: string;
  jobs_completed_display: string;
  cities_served_display: string;
  customer_satisfaction_rate: string;
};

// CategoryResource
export type Category = {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  type: "service" | "product";
  services_count?: number;
  services_count_label?: string;
};

export type ContractorBadgeFlags = {
  is_elite: boolean;
  is_id_verified: boolean;
  is_veteran_owned: boolean;
  is_available_today: boolean;
};

// ─── Home (/home) ────────────────────────────────────────────────────────────

export type HeroSpotlight = {
  id: number;
  business_name: string;
  specialty: string;
  location: string;
  avg_rating: number;
  review_count: number;
  is_elite: boolean;
  is_veteran_owned: boolean;
  is_id_verified: boolean;
  avatar: string | null;
  member_since: string | null;
  badge_label: string;
};

// TestimonialResource
export type Testimonial = {
  id: number;
  rating: number;
  comment: string;
  author_name: string;
  author_location: string;
  project_title: string;
  created_at: string | null;
};

export type HomeData = {
  hero_spotlight: HeroSpotlight | null;
  metrics: PlatformMetrics;
  categories: Category[];
  testimonials: Testimonial[];
};

// ─── Categories (/categories) ────────────────────────────────────────────────

export type CategoriesData = {
  popular_tags: string[];
  metrics: PlatformMetrics;
  categories: Category[];
};

// ─── Contractors (/contractors, /contractors/:id) ────────────────────────────

// ContractorCardResource
export type ContractorCard = {
  id: number;
  business_name: string;
  avatar: string | null;
  category_title: string;
  hourly_rate: number | null;
  hourly_rate_display: string | null;
  location: string;
  rating: number;
  review_count: number;
  badges: ContractorBadgeFlags;
  specialties: string[];
  member_since: string | null;
};

export type CredentialKey = keyof ContractorBadgeFlags;

export type ContractorBadge = "elite" | "verified" | "veteran";

export type ContractorSort =
  "rating_desc" | "reviews_desc" | "price_asc" | "price_desc" | "newest";

export type ContractorsData = {
  hero: {
    active_category: { id: number | null; name: string; subtitle: string };
    metrics: {
      services_count_display: string;
      professionals_count_display: string;
      avg_rating_display: string;
    };
  };
  popular_tags: string[];
  filter_options: {
    categories: { id: number; name: string }[];
    credentials: { key: CredentialKey; label: string }[];
    ratings: { value: number | null; label: string }[];
  };
  items: ContractorCard[];
  pagination: Pagination;
};

// ContractorProfileResource
export type ContractorProfile = {
  id: number;
  business_name: string;
  avatar: string | null;
  cover_photo: string | null;
  rating: number;
  review_count: number;
  years_experience: number;
  years_experience_display: string;
  hourly_rate: number | null;
  hourly_rate_display: string | null;
  location: {
    city: string | null;
    state: string | null;
    zip_code: string | null;
    display: string;
  };
  website_url: string | null;
  badges: ContractorBadgeFlags;
  overview: {
    bio: string;
    business_license: string;
    id_me_verified: string;
    business_hours: string;
    languages: string[];
  };
  gallery_images: string[];
  videos: string[];
  service_areas: string[];
  services: {
    id: number;
    name: string;
    description: string | null;
    pricing_type: string | null;
    price: number;
    unit: string;
    location: string;
    experience_display: string;
    category: { id: number | null; name: string | null };
  }[];
  products: {
    id: number;
    name: string;
    description: string | null;
    price: number;
    unit: string;
    is_elite_tier: boolean;
    features: string[];
    category: { id: number | null; name: string | null };
  }[];
  reviews: {
    id: number;
    rating: number;
    comment: string | null;
    author_name: string;
    author_avatar: string | null;
    project_title: string;
    created_at: string | null;
  }[];
  quick_contact: {
    headline: string;
    location: string;
    phone: string;
    email: string;
  };
};

// ─── FAQ (/faqs) ─────────────────────────────────────────────────────────────

export type FaqItem = {
  id: number;
  category: string;
  category_label: string;
  question: string;
  answer: string;
  sort_order: number;
};

export type FaqData = {
  hero: { headline: string; subtitle: string };
  filter_tabs: { key: string; label: string }[];
  items: FaqItem[];
};

// ─── Giving back (/giving-back) ──────────────────────────────────────────────

export type GivingBackData = {
  hero: {
    badge: string;
    headline: string;
    highlight: string;
    subtitle: string;
  };
  impact_metrics: { key: string; value: string; label: string }[];
  initiatives: {
    id: number;
    icon: string;
    title: string;
    description: string;
  }[];
  testimonial: {
    quote: string;
    author: string;
    author_title: string;
    location: string;
    program: string;
  };
  nomination_cta: { headline: string; subtitle: string; action_label: string };
};

export type NominationPayload = {
  nominator_name: string;
  nominator_email: string;
  nominator_phone?: string | null;
  nominee_name: string;
  nominee_branch?: string | null;
  nominee_city?: string | null;
  nominee_state?: string | null;
  project_needed: string;
  story_details: string;
};

// ─── Contact (/contact) ──────────────────────────────────────────────────────

export type ContactInfo = {
  hero: { headline: string; subtitle: string };
  support_details: {
    email: string;
    phone: string;
    address: string;
    office_hours: string;
    map_location: { city: string; state: string; pin_label: string };
  };
  user_prefill: { full_name: string | null; email: string | null };
};

export const publicApi = {
  nominateVeteran: (payload: NominationPayload) =>
    api.post<{ id: number }>("/giving-back/nominate", payload),
};

// Badge flags → the badge list used by ContractorBadges
export function badgeList(badges: ContractorBadgeFlags): ContractorBadge[] {
  const list: ContractorBadge[] = [];
  if (badges.is_elite) list.push("elite");
  if (badges.is_id_verified) list.push("verified");
  if (badges.is_veteran_owned) list.push("veteran");
  return list;
}
