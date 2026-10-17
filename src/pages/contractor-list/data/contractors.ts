export type ContractorBadge = "elite" | "verified" | "veteran";

export type Contractor = {
  id: string;
  category: string;
  name: string;
  role: string;
  price: number;
  avatar: string;
  badges: ContractorBadge[];
  location: string;
  zip: string;
  rating: number;
  reviews: number;
  services: string[];
  availableToday: boolean;
};

const services = ["AC Repair", "Heating", "Duct Cleaning", "Installation"];

const featured: Omit<Contractor, "id" | "category">[] = [
  {
    name: "Precision HVAC Solutions",
    role: "HVAC Specialist",
    price: 89,
    avatar: "/images/contractors/avatar.jpg",
    badges: ["elite", "verified", "veteran"],
    location: "Phoenix, AZ",
    zip: "85001",
    rating: 4.7,
    reviews: 256,
    services,
    availableToday: true,
  },
  {
    name: "BrightPath Accounting CPA",
    role: "Electrician",
    price: 200,
    avatar: "/images/contractors/avatar.jpg",
    badges: ["elite", "verified", "veteran"],
    location: "Phoenix, AZ",
    zip: "85003",
    rating: 4.7,
    reviews: 256,
    services,
    availableToday: true,
  },
  {
    name: "RoofGuard Pro",
    role: "Plumbing",
    price: 100,
    avatar: "/images/contractors/avatar.jpg",
    badges: ["elite", "verified"],
    location: "Phoenix, AZ",
    zip: "85004",
    rating: 4.7,
    reviews: 256,
    services,
    availableToday: true,
  },
  {
    name: "Eagle Eye Legal Group",
    role: "HVAC Specialist",
    price: 120,
    avatar: "/images/contractors/avatar.jpg",
    badges: ["verified", "veteran"],
    location: "Phoenix, AZ",
    zip: "85006",
    rating: 4.7,
    reviews: 256,
    services,
    availableToday: false,
  },
  {
    name: "Precision HVAC Solutions",
    role: "HVAC Specialist",
    price: 90,
    avatar: "/images/contractors/avatar.jpg",
    badges: ["verified"],
    location: "Phoenix, AZ",
    zip: "85007",
    rating: 4.7,
    reviews: 256,
    services,
    availableToday: true,
  },
  {
    name: "Precision HVAC Solutions",
    role: "HVAC Specialist",
    price: 89,
    avatar: "/images/contractors/avatar.jpg",
    badges: ["verified", "veteran"],
    location: "Phoenix, AZ",
    zip: "85008",
    rating: 4.7,
    reviews: 256,
    services,
    availableToday: false,
  },
];

// Mock listing (3 pages) until the contractors API is wired up
export const contractors: Contractor[] = Array.from({ length: 3 }).flatMap(
  (_, page) =>
    featured.map((contractor, index) => ({
      id: String(page * featured.length + index + 1),
      category: "blue-collar",
      ...contractor,
    })),
);
