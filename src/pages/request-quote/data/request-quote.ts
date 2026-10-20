import {
  Box,
  Cpu,
  Hammer,
  House,
  Paintbrush,
  Scissors,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type QuoteFormValues = {
  service: string;
  description: string;
  photos: File[];
  budget: string;
  timeline: string;
  street_address: string;
  zip_code: string;
  city: string;
  state: string;
};

export const initialValues: QuoteFormValues = {
  service: "",
  description: "",
  photos: [],
  budget: "",
  timeline: "",
  street_address: "",
  zip_code: "",
  city: "",
  state: "",
};

// Options come from GET /quotes/wizard-config; icons are matched by service key
export const serviceIcons: Record<string, LucideIcon> = {
  roofing: House,
  hvac: Zap,
  electrical: Cpu,
  landscaping: Scissors,
  plumbing: Wrench,
  painting: Paintbrush,
  contracting: Hammer,
  other: Box,
};

export const requestQuote = {
  // The API has no upload endpoint for quote photos yet; flip on once it does
  photoUploads: false,
  title: "Request a Quote",
  back: "Back to Profile",
  backFallback: "Back",
  steps: [
    { key: "service", label: "Service", progress: 11.2 },
    { key: "description", label: "Description", progress: 25.6 },
    { key: "budget_timeline", label: "Budget & Timeline", progress: 51.6 },
    { key: "location", label: "Location", progress: 75.8 },
    { key: "review", label: "Review", progress: 100 },
  ],
  actions: {
    previous: "Previous",
    next: "Continue",
    submit: "Submit Request",
    submitting: "Submitting...",
  },
  service: {
    title: "What service do you need?",
    description: "Select the type of service for your project.",
    error: "Please select a service.",
  },
  description: {
    title: "Describe your project",
    description: "Be specific so contractors can provide accurate quotes.",
    placeholder:
      "Describe your project in detail size, current condition, materials, specific concerns, expected scope...",
    min: 5,
    max: 5000,
    upload: {
      label: "Upload Photos (optional)",
      prompt: "Click to upload or drag & drop",
      hint: "PNG, JPG up to 10MB",
      maxSize: 10 * 1024 * 1024,
      maxFiles: 6,
      accept: ["image/png", "image/jpeg"],
    },
  },
  budgetTimeline: {
    title: "Budget & Timeline",
    description: "Help pros understand your budget and timing needs.",
    budgetLabel: "Budget Range",
    timelineLabel: "When do you need this done?",
    budgetError: "Please select a budget range.",
    timelineError: "Please select when you need this done.",
  },
  location: {
    title: "Project Location",
    description: "Where will the work be performed?",
    fields: {
      street_address: {
        label: "Street Address",
        placeholder: "123 Main Street",
        max: 255,
        required: false,
      },
      zip_code: {
        label: "ZIP Code",
        placeholder: "75201",
        max: 20,
        required: true,
      },
      city: { label: "City", placeholder: "Dallas", max: 100, required: true },
      state: { label: "State", placeholder: "TX", max: 100, required: true },
    },
  },
  review: {
    title: "Review & Submit",
    description: "Review your request before submitting.",
    rows: {
      service: "Service Type",
      description: "Description",
      budget: "Budget",
      timeline: "Timeline",
      location: "Location",
    },
    recipientNote: "They will respond with a detailed quote within 24 hours.",
    nearbyRecipient: "nearby contractors",
  },
  auth: {
    guest: "Log in or create a free account to send your request.",
    login: "Log in to submit",
    register: "Create an account",
    business:
      "Quote requests are sent from customer accounts. Log out of your business account to request a quote.",
  },
  success: {
    title: "Request submitted!",
    description:
      "Your service request has been sent to nearby contractors. You will start receiving quotes shortly — usually within 24 hours.",
    reference: "Request",
    viewRequests: "View my requests",
    dashboard: "Back to Dashboard",
  },
};
