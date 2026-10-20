import type { Pagination } from "@/lib/api";
import { mediaUrl } from "@/lib/media";
import type { Category } from "./public";

// ProductCardResource
export type ProductCard = {
  id: number;
  name: string;
  image: string | null;
  price: number;
  price_display: string;
  unit: string | null;
  is_elite_tier: boolean;
  is_trending: boolean;
  in_stock: boolean;
  category: { id: number | null; name: string };
  seller: {
    id: number | null;
    business_name: string;
    avatar: string | null;
    is_elite: boolean;
    is_id_verified: boolean;
    is_veteran_owned: boolean;
  };
};

export type MarketplaceLanding = {
  categories: Category[];
  trending_products: ProductCard[];
};

export type ProductCredentialKey =
  "is_elite" | "is_id_verified" | "is_veteran_owned";

export type ProductsData = {
  filter_options: {
    categories: { id: number; name: string }[];
    price_range: { min: number; max: number };
    credentials: { key: ProductCredentialKey; label: string }[];
  };
  items: ProductCard[];
  pagination: Pagination;
};

// ProductDetailResource
export type ProductDetail = {
  id: number;
  name: string;
  description: string;
  price: number;
  price_display: string;
  unit: string | null;
  is_elite_tier: boolean;
  rating: number;
  review_count: number;
  image: string | null;
  gallery_images: string[];
  in_stock: boolean;
  external_url: string | null;
  redirection_notice: string;
  features: string[];
  specifications: { label: string; value: string }[];
  seller: {
    id: number | null;
    business_name: string | null;
    avatar: string | null;
    rating: number;
    review_count: number;
    is_elite: boolean;
    is_id_verified: boolean;
    is_veteran_owned: boolean;
    location: string;
    website_url: string | null;
  };
  category: { id: number | null; name: string };
  related_products: ProductCard[];
  reviews: {
    id: number;
    rating: number;
    comment: string | null;
    author_name: string;
    author_avatar: string | null;
    created_at: string | null;
  }[];
};

// The API fills missing images/links with *.test placeholders; treat those as absent
function isPlaceholder(url: string | null | undefined) {
  return !url || /^https?:\/\/[^/]*\.test(\/|$)/.test(url);
}

export function productImage(path: string | null | undefined) {
  return isPlaceholder(path) ? null : mediaUrl(path);
}

export function externalLink(url: string | null | undefined) {
  return isPlaceholder(url) ? null : url!;
}
