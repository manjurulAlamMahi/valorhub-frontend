export type FaqCategory = "customers" | "contractors" | "payments";

export const faq = {
  title: "Frequently asked questions",
  description: "Answers to common questions about using ValorHub.",
  tabs: [
    { label: "All", value: "all" },
    { label: "For Customers", value: "customers" },
    { label: "For Contractors", value: "contractors" },
    { label: "Payments & Billing", value: "payments" },
  ],
  // Placeholder answers — confirm the final copy with the ValorHub team
  items: [
    {
      id: "request-quote",
      category: "customers",
      question: "How do I request a quote from a contractor?",
      answer:
        'Browse contractors by category or search, view their profile, and click "Request Quote." Describe your project and you\'ll receive quotes within 24 hours.',
    },
    {
      id: "free-for-customers",
      category: "customers",
      question: "Is ValorHub free to use as a customer?",
      answer:
        "Yes. Searching for contractors, comparing profiles, and requesting quotes is completely free for customers.",
    },
    {
      id: "platform-fee",
      category: "payments",
      question: "How does the platform fee work?",
      answer:
        "Contractors pay a small platform fee on completed jobs. A portion of every fee goes toward supporting veteran and first-responder causes through our Giving Back program.",
    },
    {
      id: "elite-member",
      category: "contractors",
      question: 'What does "Elite Member" mean for a contractor?',
      answer:
        "Elite Members are verified contractors with a strong track record of ratings and completed jobs. They get priority placement, an Elite badge, and access to features like profile videos.",
    },
    {
      id: "become-contractor",
      category: "contractors",
      question: "How do I become a contractor on ValorHub?",
      answer:
        'Click "Join as a Pro," create your business profile, and complete identity verification through ID.me. Once approved, you can start receiving quote requests.',
    },
    {
      id: "payments-processed",
      category: "payments",
      question: "How are payments processed?",
      answer:
        "Once your project is complete, you'll receive an invoice and can pay securely through ValorHub. Payment details are encrypted and never shared with contractors.",
    },
  ] satisfies {
    id: string;
    category: FaqCategory;
    question: string;
    answer: string;
  }[],
};
