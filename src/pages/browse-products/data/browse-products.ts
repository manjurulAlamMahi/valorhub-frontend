import type { ProductCredentialKey } from "@/services/marketplace";

export const PAGE_SIZE = 9;

export const credentialKeys: ProductCredentialKey[] = [
  "is_elite",
  "is_id_verified",
  "is_veteran_owned",
];

// Filters live in the URL so results are shareable and survive back/forward
export type ProductFilters = {
  search: string;
  categories: number[];
  min_price: number | null;
  max_price: number | null;
  credentials: ProductCredentialKey[];
  in_stock_only: boolean;
  page: number;
};

export function readFilters(params: URLSearchParams): ProductFilters {
  const price = (key: string) => {
    const value = params.get(key);
    return value === null || value === "" || Number.isNaN(Number(value))
      ? null
      : Number(value);
  };

  return {
    search: params.get("search") ?? "",
    categories: (params.get("categories") ?? "")
      .split(",")
      .map(Number)
      .filter((id) => Number.isInteger(id) && id > 0),
    min_price: price("min_price"),
    max_price: price("max_price"),
    credentials: credentialKeys.filter((key) => params.get(key) === "1"),
    in_stock_only: params.get("in_stock_only") === "1",
    page: Math.max(Number(params.get("page")) || 1, 1),
  };
}

export const browseProducts = {
  title: "Browse Products",
  description:
    "Shop parts, equipment, and service bundles from verified ValorHub sellers.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Browse Products", href: "/marketplace/products" },
  ],
  badge: "Elite",
  cta: "View Product",
  empty: "No products match your filters.",
  filters: {
    title: "Filters",
    reset: "Reset all",
    price: "Price range",
    category: "Category",
    credentials: "Seller credentials",
    availability: {
      label: "Availability",
      option: "In stock only",
    },
  },
};
