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
      name: "q",
      placeholder: "Search products, parts, or equipment",
      cta: "Search",
    },
  },
  categories: {
    title: "Shop by category",
    items: [
      {
        slug: "plumbing",
        label: "Plumbing Supplies",
        image: `${images}/gallery/1.jpg`,
      },
      {
        slug: "electrical",
        label: "Electrical Supplies",
        image: `${images}/gallery/2.jpg`,
      },
      {
        slug: "hvac",
        label: "HVAC Equipment",
        image: `${images}/gallery/3.jpg`,
      },
      {
        slug: "roofing",
        label: "Roofing Materials",
        image: `${images}/gallery/5.jpg`,
      },
      {
        slug: "hardware",
        label: "General Hardware",
        image: `${images}/videos/1.jpg`,
      },
    ],
  },
  products: {
    title: "Trending products",
    resultsTitle: "Search results",
    seeAll: "See all",
    badge: "Elite",
    empty: "No products match your search.",
  },
  cta: {
    title: "Have products or parts to sell?",
    description:
      "List your inventory on the ValorHub Marketplace and reach thousands of homeowners.",
    action: { label: "List a product", link: "/join" },
  },
};
