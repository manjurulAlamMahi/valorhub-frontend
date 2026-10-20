const images = "/images/contractor-profile";

export const marketplace = {
  hero: {
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Marketplace", href: "/marketplace" },
    ],
    headline: "Shop products directly from",
    highlight: "trusted contractors",
    description:
      "Browse parts, equipment, and service bundles listed by verified ValorHub professionals.",
    search: {
      action: "/marketplace/products",
      name: "search",
      placeholder: "Search products, parts, or equipment",
      cta: "Search",
    },
  },
  categories: {
    title: "Shop by category",
    // Categories have no artwork in the API, so tiles cycle through these
    images: [
      `${images}/gallery/1.jpg`,
      `${images}/gallery/2.jpg`,
      `${images}/gallery/3.jpg`,
      `${images}/gallery/5.jpg`,
      `${images}/videos/1.jpg`,
    ],
  },
  products: {
    title: "Trending products",
    seeAll: "See all",
    badge: "Elite",
    empty: "No products listed yet.",
  },
  cta: {
    title: "Have products or parts to sell?",
    description:
      "List your inventory on the ValorHub Marketplace and reach thousands of homeowners.",
    label: "List a product",
  },
};
