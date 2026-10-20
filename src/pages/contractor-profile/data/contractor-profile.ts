// Static copy for the contractor profile; content comes from GET /contractors/:id
export const contractorProfile = {
  title: "Contractor Profile",
  // Shown until the contractor uploads a cover photo
  cover: "/images/contractor-profile/cover.jpg",
  actions: {
    save: "Save contractor",
    share: "Share profile",
    website: "Visit website",
  },
  overview: { title: "Company Overview" },
  contact: { title: "Quick Contact", cta: "Request Quote" },
  gallery: { title: "Project Gallery" },
  videos: { title: "Video", note: "(Elite Only)" },
  services: { title: "Services Offered" },
  products: {
    title: "Our Product",
    seeAll: "See all",
    badge: "Elite",
    cta: "View product",
  },
  location: {
    title: "Service Location",
    note: "Map integration available",
    areasTitle: "Service Areas",
  },
  reviews: {
    title: "Customer Reviews",
    add: "Add Review",
    empty: "No reviews yet.",
  },
};
