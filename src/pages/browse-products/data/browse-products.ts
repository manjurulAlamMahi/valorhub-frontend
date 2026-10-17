import { products } from "@/pages/marketplace/data/products";

export type ProductFiltersState = {
  price: [number, number];
  categories: string[];
  credentials: string[];
  inStock: boolean;
};

const prices = products.map((product) => product.price);

export const priceBounds: [number, number] = [
  Math.floor(Math.min(...prices) / 10) * 10,
  Math.ceil(Math.max(...prices) / 10) * 10,
];

export const initialFilters: ProductFiltersState = {
  price: priceBounds,
  categories: [],
  credentials: [],
  inStock: false,
};

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
    credentials: {
      label: "Seller credentials",
      options: [
        { label: "Elite Member", value: "elite" },
        { label: "Verified", value: "verified" },
        { label: "Veteran Owned", value: "veteran" },
      ],
    },
    availability: {
      label: "Availability",
      option: "In stock only",
    },
  },
};
