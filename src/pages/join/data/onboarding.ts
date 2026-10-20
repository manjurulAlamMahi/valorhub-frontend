import type { MembershipPlan } from "@/services/onboarding";

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
  // Price for a year when billed annually (from the API); falls back to the 20% formula
  annualPrice?: number;
};

export const businessTypes = [
  "LLC",
  "Sole Proprietor",
  "Corporation",
  "Partnership",
] as const;

export const toPlan = (plan: MembershipPlan): Plan => ({
  id: plan.id,
  name: plan.name,
  slug: plan.slug,
  monthlyPrice: plan.monthly_price,
  isPopular: plan.is_popular,
  features: plan.features,
  serviceLimit: plan.limits.service_limit,
  annualPrice: plan.annual_price ?? undefined,
});

// Annual billing is 12 months with the advertised 20% discount
export const annualPrice = (plan: Plan) =>
  plan.annualPrice ?? Math.round(plan.monthlyPrice * 12 * 0.8);

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
