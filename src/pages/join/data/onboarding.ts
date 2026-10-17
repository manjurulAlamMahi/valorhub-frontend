export type Stage =
  | "account"
  | "membership"
  | "checkout"
  | "verification"
  | "verification-failed"
  | "business-info"
  | "profile"
  | "social"
  | "services"
  | "review"
  | "done";

export type Plan = {
  id: number;
  name: string;
  slug: string;
  monthlyPrice: number;
  isPopular: boolean;
  features: string[];
  // null = unlimited
  serviceLimit: number | null;
};

export const businessTypes = [
  "LLC",
  "Sole Proprietor",
  "Corporation",
  "Partnership",
] as const;

export const businessCategories = [
  "Blue Collar",
  "White Collar",
  "Grey Collar",
  "Gold Collar",
  "Other",
] as const;

// Mirrors the backend SubscriptionPlanSeeder
export const plans: Plan[] = [
  {
    id: 1,
    name: "Free Verified Membership",
    slug: "free",
    monthlyPrice: 0,
    isPopular: true,
    serviceLimit: 3,
    features: [
      "Maximum 3 services",
      "Basic business information",
      "Business logo upload",
      "No premium features",
    ],
  },
  {
    id: 2,
    name: "Pro Verified Membership",
    slug: "pro",
    monthlyPrice: 29,
    isPopular: false,
    serviceLimit: 10,
    features: [
      "10 service listings",
      "20 photo uploads",
      "Featured listing",
      "Priority search ranking",
      "Standard leads",
      "Custom business URL",
    ],
  },
  {
    id: 3,
    name: "Elite Verified Membership",
    slug: "elite",
    monthlyPrice: 49,
    isPopular: false,
    serviceLimit: null,
    features: [
      "Unlimited services",
      "20 gallery images",
      "5 video uploads",
      "Website & social links",
      "Brand information",
      "Business hours & 24/7",
      "Homepage banner ad",
      "Featured badge",
      "Priority marketplace promotion",
      "Premium support",
    ],
  },
];

// Annual billing is 12 months with the advertised 20% discount
export const annualPrice = (plan: Plan) =>
  Math.round(plan.monthlyPrice * 12 * 0.8);

export const popularServices = [
  "Plumbing",
  "Electrical",
  "HVAC Installation",
  "Handyman",
  "Roofing",
  "Painting",
  "Landscaping",
  "Carpentry",
  "Locksmith",
  "Pest Control",
];

// Searchable catalogue on top of the popular chips
export const serviceCatalog = [
  ...popularServices,
  "Appliance Repair",
  "Cabinet Installation",
  "Carpet Cleaning",
  "Concrete & Masonry",
  "Deck Building",
  "Drywall Repair",
  "Fencing",
  "Flooring",
  "Garage Door Repair",
  "Gutter Cleaning",
  "Home Inspection",
  "House Cleaning",
  "HVAC Repair",
  "Insulation",
  "Junk Removal",
  "Kitchen Remodeling",
  "Bathroom Remodeling",
  "Moving Services",
  "Pool Maintenance",
  "Pressure Washing",
  "Siding",
  "Solar Installation",
  "Tile Installation",
  "Tree Service",
  "Water Heater Repair",
  "Window Installation",
];

export const onboarding = {
  seo: {
    title: "Join as a Pro",
    description:
      "Create your ValorHub contractor account, choose a verified membership and start receiving leads from customers who want to hire veteran-owned businesses.",
  },
  // Step indicator labels; Social Links is skipped on the free plan
  steps: {
    account: "Account",
    verification: "Verification",
    "business-info": "Business Info",
    profile: "Business Profile",
    social: "Social Links",
    services: "Services",
    review: "Review",
  } as Partial<Record<Stage, string>>,
  account: {
    title: "Create Your Account",
    description: "Start building your professional profile on ValorHub",
  },
  membership: {
    title: "Choose Your Membership",
    description:
      "Choose a verified membership. ID.me verification is required before continuing.",
    popular: "Most Popular",
  },
  checkout: {
    back: "Back to plans",
    title: "Complete your subscription",
    secure: "Secured by Stripe · 256-bit SSL encryption",
  },
  verification: {
    title: "Verify Your Military Status",
    description:
      "ValorHub uses ID.me to verify Veteran, Military, and First Responder status",
    heading: "ID.me Identity Verification",
    body: "Verify your veteran, military, or first responder status with ID.me. If verification cannot be completed, signup stops here.",
    cta: "Verify with ID.me",
    required: "Verification is required to continue",
    verified: "Your military status has been verified",
    continue: "Continue after verification",
  },
  verificationFailed: {
    title: "Verification failed",
    description: "We're unable to verify your military status with ID.me.",
    headline: "Contractor memberships are available",
    highlight: "only to verified military members.",
    body: "To protect our community, we can't continue with your contractor account signup.",
    whyTitle: "Why verification is required",
    reasons: [
      "Ensures contractor membership is exclusive to military members and veterans.",
      "Helps maintain trust and integrity in our community.",
      "Keeps your information secure and protected.",
    ],
    home: "Return to Home",
    retry: "Verify again?",
  },
  businessInfo: {
    title: "Business Information",
    description: "Tell customers about your business",
  },
  profile: {
    title: "Business Profile",
    description: "Add details that build customer trust",
  },
  social: {
    title: "Website & Social Links",
    description: "Add your website and social profiles.",
  },
  services: {
    title: "Service Selection",
  },
  review: {
    title: "Review your application",
    description: "Please confirm your details before submitting for approval.",
    terms:
      "I agree to the ValorHub Contractor Terms and confirm all information is accurate.",
    submit: "Submit application",
  },
  done: {
    title: "You're all set!",
    description:
      "Your ValorHub contractor account is active. You can now start receiving leads and managing quotes today.",
    cta: "Go to Dashboard",
  },
};
