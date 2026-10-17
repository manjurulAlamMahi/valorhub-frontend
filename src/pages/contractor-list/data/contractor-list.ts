export type ContractorFiltersState = {
  zip: string;
  credentials: string[];
  minRating: number;
};

export const initialFilters: ContractorFiltersState = {
  zip: "",
  credentials: [],
  minRating: 0,
};

export const contractorList = {
  title: "Contractor List",
  pageSize: 6,
  stats: [
    { value: "180+", label: "Services" },
    { value: "3,763+", label: "Professionals" },
    { value: "4.8★", label: "Avg Rating" },
  ],
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
    category: {
      label: "Category",
      options: [
        { label: "Blue Collar", slug: "blue-collar" },
        { label: "White Collar", slug: "white-collar" },
        { label: "Grey Collar", slug: "grey-collar" },
        { label: "Gold Collar", slug: "gold-collar" },
        { label: "Other Services", slug: "other-services" },
      ],
    },
    credentials: {
      label: "Credentials",
      options: [
        { label: "Veteran Owned", value: "veteran" },
        { label: "Elite Member", value: "elite" },
        { label: "Verified", value: "verified" },
        { label: "Available Today", value: "available" },
      ],
    },
    rating: {
      label: "Minimum Rating",
      options: [
        { label: "Any Rating", value: 0 },
        { label: "4.5+ Stars", value: 4.5 },
        { label: "4.0+ Stars", value: 4 },
        { label: "3.5+ Stars", value: 3.5 },
      ],
    },
  },
  empty: "No contractors match your filters.",
};
