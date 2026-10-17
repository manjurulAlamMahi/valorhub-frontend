import { faker } from "@faker-js/faker";

const gallery = "/images/contractor-profile/gallery";

// Mock profile content until the contractor profile API is wired up
export const contractorProfile = {
  title: "Contractor Profile",
  cover: "/images/contractor-profile/cover.jpg",
  photo: "/images/contractor-profile/profile.jpg",
  rating: 4.9,
  reviewCount: 127,
  experience: "15 years experience",
  zip: "12785",
  website: "https://valorhub.com",
  actions: {
    save: "Save contractor",
    share: "Share profile",
    website: "Visit website",
  },
  overview: {
    title: "Company Overview",
    description:
      "Valor Construction Group is a highly-rated, veteran-owned general contractor company serving Dallas, TX and surrounding areas. With over 14 years of experience, we pride ourselves on delivering exceptional quality, honest pricing, and reliable service to every customer. Our team is fully licensed, insured, and dedicated to your satisfaction.",
    facts: [
      { label: "Business License", value: "Verified ✓", verified: true },
      { label: "Hours", value: "Mon–Sat 7am–7pm" },
      { label: "ID.me Verified", value: "Yes ✓", verified: true },
      { label: "Languages", value: "English, Spanish" },
    ],
  },
  contact: {
    title: "Quick Contact",
    description:
      "Request a free quote from John and get a response within 24 hours.",
    cta: "Request Quote",
    location: "New York, NY",
    phone: "(555) 123-4567",
    email: "john@smithplumbing.com",
  },
  gallery: {
    title: "Project Gallery",
    images: [
      `${gallery}/1.jpg`,
      `${gallery}/2.jpg`,
      `${gallery}/3.jpg`,
      `${gallery}/4.jpg`,
      `${gallery}/5.jpg`,
      `${gallery}/5.jpg`,
    ],
  },
  videos: {
    title: "Video",
    note: "(Elite Only)",
    items: [
      {
        id: faker.string.uuid(),
        thumbnail: "/images/contractor-profile/videos/1.jpg",
      },
      {
        id: faker.string.uuid(),
        thumbnail: "/images/contractor-profile/videos/2.jpg",
      },
    ],
  },
  services: {
    title: "Services Offered",
    items: [
      {
        id: faker.string.uuid(),
        name: "Plumbing Services",
        location: "New York, NY",
        price: "$80/hr",
        experience: "12 years experience",
      },
      {
        id: faker.string.uuid(),
        name: "Electrical Services",
        location: "New York, NY",
        price: "$80/hr",
        experience: "12 years experience",
      },
      {
        id: faker.string.uuid(),
        name: "John Smith Plumbing",
        location: "New York, NY",
        price: "$80/hr",
        experience: "12 years experience",
      },
      {
        id: faker.string.uuid(),
        name: "Electrical Services",
        location: "New York, NY",
        price: "$80/hr",
        experience: "12 years experience",
      },
    ],
  },
  products: {
    title: "Our Product",
    seeAll: "See all",
    badge: "Elite",
    cta: "Visit website",
    items: [
      {
        id: faker.string.uuid(),
        name: "Premium Pipe Repair & Installation",
        category: "Plumbing",
        image: `${gallery}/1.jpg`,
        location: "New York, NY",
        experience: "12 years experience",
        price: "$80/hr",
        url: "https://steelplumbingco.com",
      },
      {
        id: faker.string.uuid(),
        name: "Full-Home Electrical Rewiring",
        category: "Electrical",
        image: `${gallery}/2.jpg`,
        location: "New York, NY",
        experience: "12 years experience",
        price: "$80/hr",
        url: "https://ironcladelectric.com",
      },
      {
        id: faker.string.uuid(),
        name: "24/7 Emergency Plumbing Service",
        category: "Plumbing",
        image: `${gallery}/3.jpg`,
        location: "New York, NY",
        experience: "12 years experience",
        price: "$80/hr",
        url: "https://steelplumbingco.com/emergency",
      },
      {
        id: faker.string.uuid(),
        name: "Smart Panel & Circuit Upgrade",
        category: "Electrical",
        image: `${gallery}/5.jpg`,
        location: "New York, NY",
        experience: "12 years experience",
        price: "$80/hr",
        url: "https://ironcladelectric.com/panel-upgrade",
      },
    ],
  },
  location: {
    title: "Service Location",
    city: "Atlanta, GA",
    note: "Map integration available",
    areasTitle: "Service Areas",
    areas: ["Downtown", "North Side", "South Side", "Suburbs", "Metro Area"],
  },
  reviews: {
    title: "Customer Reviews",
    add: "Add Review",
    items: [
      {
        id: faker.string.uuid(),
        author: "Sarah Johnson",
        date: "2 weeks ago",
        rating: 5,
        text: "John was fantastic! He fixed our kitchen leak quickly and professionally. Very reasonable pricing and excellent communication throughout the process.",
      },
      {
        id: faker.string.uuid(),
        author: "Michael Chen",
        date: "1 month ago",
        rating: 5,
        text: "Highly recommend! Installed our new water heater and everything works perfectly. Very clean and professional work.",
      },
      {
        id: faker.string.uuid(),
        author: "Emily Rodriguez",
        date: "2 months ago",
        rating: 4,
        text: "Great service and very reliable. Arrived on time and completed the work as promised. Will definitely use again.",
      },
    ],
  },
};
