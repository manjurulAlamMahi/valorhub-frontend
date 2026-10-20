import type { CredentialKey } from "@/services/public";

export const PAGE_SIZE = 6;

// Filters live in the URL so results are shareable and survive back/forward
export type ContractorFilters = {
  service: string;
  zip_code: string;
  credentials: CredentialKey[];
  min_rating: number | null;
  page: number;
};

export const credentialKeys: CredentialKey[] = [
  "is_veteran_owned",
  "is_elite",
  "is_id_verified",
  "is_available_today",
];

export function readFilters(params: URLSearchParams): ContractorFilters {
  const rating = Number(params.get("min_rating"));
  return {
    service: params.get("service") ?? "",
    zip_code: params.get("zip_code") ?? "",
    credentials: credentialKeys.filter((key) => params.get(key) === "1"),
    min_rating: rating > 0 ? rating : null,
    page: Math.max(Number(params.get("page")) || 1, 1),
  };
}

export const contractorList = {
  title: "Contractor List",
  allTitle: "All Professionals",
  allDescription:
    "Browse verified veteran-owned professionals across the United States.",
  stats: [
    { key: "services_count_display", label: "Services" },
    { key: "professionals_count_display", label: "Professionals" },
    { key: "avg_rating_display", label: "Avg Rating" },
  ] as const,
  badges: {
    elite: {
      label: "Elite",
      className: "border-[#fee685] bg-[#fef3c6] text-[#bb4d00]",
    },
    verified: {
      label: "Verified",
      className: "border-[#bedbff] bg-[#eff6ff] text-[#1447e6]",
    },
    veteran: {
      label: "Veteran Owned",
      className: "border-[#e9d4ff] bg-secondary text-secondary-foreground",
    },
  },
  availableToday: "Available Today",
  cta: {
    quote: "Request Quote",
    profile: "Profile",
  },
  filters: {
    title: "Filters",
    clear: "Clear",
    zip: {
      label: "Zip Code",
      placeholder: "Enter zip code",
    },
    category: { label: "Category" },
    credentials: { label: "Credentials" },
    rating: { label: "Minimum Rating" },
  },
  empty: "No contractors match your filters.",
};
