import {
  Box,
  Cpu,
  Hammer,
  House,
  Paintbrush,
  Scissors,
  Wrench,
  Zap,
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

// Keys and labels mirror Backend QuoteRequestController::config()
export const requestQuote = {
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
    options: [
      { key: "roofing", label: "Roofing", icon: House },
      { key: "hvac", label: "HVAC", icon: Zap },
      { key: "electrical", label: "Electrical", icon: Cpu },
      { key: "landscaping", label: "Landscaping", icon: Scissors },
      { key: "plumbing", label: "Plumbing", icon: Wrench },
      { key: "painting", label: "Painting", icon: Paintbrush },
      { key: "contracting", label: "Contracting", icon: Hammer },
      { key: "other", label: "Other", icon: Box },
    ],
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
    budgets: [
      { key: "under_1000", label: "Under $1,000" },
      { key: "1000_5000", label: "$1,000–$5,000" },
      { key: "5000_15000", label: "$5,000–$15,000" },
      { key: "15000_plus", label: "$15,000+" },
    ],
    timelines: [
      { key: "asap", label: "ASAP" },
      { key: "within_1_week", label: "Within 1 week" },
      { key: "within_1_month", label: "Within 1 month" },
      { key: "flexible", label: "Flexible" },
    ],
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
  success: {
    title: "Request submitted!",
    description:
      "Your service request has been sent to nearby contractors. You will start receiving quotes shortly — usually within 24 hours.",
    reference: "Request",
    viewRequests: "View my requests",
    dashboard: "Back to Dashboard",
  },
};
