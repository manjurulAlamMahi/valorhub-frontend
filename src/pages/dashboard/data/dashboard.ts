// Mock customer data until the customer portal API (Backend /api/customer/*) is wired up

export type RequestStatus =
  "pending" | "in_progress" | "completed" | "cancelled";
export type QuoteStatus = "pending" | "accepted" | "declined";
export type InvoiceStatus = "pending" | "paid";

export const statusStyles = {
  pending: { label: "Pending", className: "bg-[#f59e0b]/10 text-[#f59e0b]" },
  in_progress: {
    label: "In Progress",
    className: "bg-secondary-foreground/10 text-secondary-foreground",
  },
  completed: {
    label: "Completed",
    className: "bg-[#16a34a]/10 text-[#16a34a]",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-[#c92032]/10 text-[#c92032]",
  },
  accepted: { label: "Accepted", className: "bg-[#16a34a]/10 text-[#16a34a]" },
  declined: { label: "Declined", className: "bg-[#c92032]/10 text-[#c92032]" },
  paid: { label: "Paid", className: "bg-[#16a34a]/10 text-[#16a34a]" },
} as const;

export type StatusKey = keyof typeof statusStyles;

export const user = {
  name: "Sarah Johnson",
  firstName: "Sarah",
  email: "sarah.j@email.com",
  phone: "(555) 987-6543",
  avatar: "/images/dashboard/avatar.png",
  emailNotifications: true,
};

export const navigation = [
  { label: "Dashboard", href: "/dashboard", end: true },
  { label: "My Requests", href: "/dashboard/requests" },
  { label: "Quotes", href: "/dashboard/quotes" },
  { label: "Invoices", href: "/dashboard/invoices" },
  { label: "Payments", href: "/dashboard/payments" },
  { label: "Saved Contractors", href: "/dashboard/saved" },
  { label: "Reviews", href: "/dashboard/reviews" },
  { label: "Inbox", href: "/dashboard/inbox" },
  { label: "Notifications", href: "/dashboard/notifications" },
  { label: "Settings", href: "/dashboard/settings" },
];

export const stats = {
  completedJobs: 12,
  totalSpent: 2340,
};

export type ServiceRequest = {
  id: string;
  title: string;
  contractor: string;
  postedAt: string;
  status: RequestStatus;
};

export const requests: ServiceRequest[] = [
  {
    id: "req-1",
    title: "Kitchen Plumbing Repair",
    contractor: "Steel Plumbing Co.",
    postedAt: "Jul 10, 2026",
    status: "pending",
  },
  {
    id: "req-2",
    title: "Panel Rewiring",
    contractor: "Ironclad Electric",
    postedAt: "Jun 28, 2026",
    status: "in_progress",
  },
  {
    id: "req-3",
    title: "AC Maintenance",
    contractor: "Sentinel HVAC",
    postedAt: "Jun 02, 2026",
    status: "completed",
  },
  {
    id: "req-4",
    title: "Roof Leak Inspection",
    contractor: "RoofGuard Pro",
    postedAt: "May 22, 2026",
    status: "completed",
  },
  {
    id: "req-5",
    title: "Bathroom Remodel Quote",
    contractor: "Master Carpentry Co.",
    postedAt: "May 10, 2026",
    status: "cancelled",
  },
];

export type Quote = {
  id: string;
  requestId: string;
  contractor: string;
  contractorMeta: string;
  summary: string;
  submittedAt: string;
  labor: number;
  materials: number;
  tax: number;
  completion: string;
  notes: string;
};

export const quotes: Quote[] = [
  {
    id: "q-1",
    requestId: "req-1",
    contractor: "Steel Plumbing Co.",
    contractorMeta: "★ 4.9 (127 reviews) · Verified · Veteran Owned",
    summary: "Labor + materials, 1-day completion",
    submittedAt: "Jul 11, 2026",
    labor: 280,
    materials: 120,
    tax: 20,
    completion: "1 day, starting within 3 business days of acceptance.",
    notes:
      "Includes a 1-year warranty on parts and labor. Will bring all necessary materials.",
  },
  {
    id: "q-2",
    requestId: "req-1",
    contractor: "Ironclad Electric",
    contractorMeta: "★ 4.7 (256 reviews) · Verified",
    summary: "Includes parts warranty, 2-day completion",
    submittedAt: "Jul 12, 2026",
    labor: 340,
    materials: 145,
    tax: 25,
    completion: "2 days, starting within 5 business days of acceptance.",
    notes: "Parts are covered by a 2-year manufacturer warranty.",
  },
  {
    id: "q-3",
    requestId: "req-2",
    contractor: "Sentinel Electric",
    contractorMeta: "★ 4.8 (98 reviews) · Verified · Veteran Owned",
    summary: "Full panel upgrade, 3-day completion",
    submittedAt: "Jun 30, 2026",
    labor: 450,
    materials: 196,
    tax: 34,
    completion: "3 days, starting within 1 week of acceptance.",
    notes:
      "Permit filing is included. Power will be off for about 4 hours on day 2.",
  },
];

export const quoteTotal = (quote: Quote) =>
  quote.labor + quote.materials + quote.tax;

export type Invoice = {
  id: string;
  contractor: string;
  dueAt: string;
  paidAt?: string;
  status: InvoiceStatus;
  labor: number;
  materials: number;
  fee: number;
};

export const invoices: Invoice[] = [
  {
    id: "INV-1042",
    contractor: "Steel Plumbing Co.",
    dueAt: "Jul 21, 2026",
    status: "pending",
    labor: 300,
    materials: 120,
    fee: 42,
  },
  {
    id: "INV-1039",
    contractor: "Sentinel HVAC",
    dueAt: "Jun 05, 2026",
    paidAt: "Jun 05, 2026",
    status: "paid",
    labor: 200,
    materials: 82,
    fee: 28,
  },
  {
    id: "INV-1031",
    contractor: "Ironclad Electric",
    dueAt: "May 12, 2026",
    paidAt: "May 12, 2026",
    status: "paid",
    labor: 380,
    materials: 147.27,
    fee: 52.73,
  },
];

export const invoiceTotal = (invoice: Invoice) =>
  invoice.labor + invoice.materials + invoice.fee;

// Older payments that predate the invoices listed above
export const paymentHistory = [
  {
    invoiceId: "INV-1022",
    contractor: "RoofGuard Pro",
    amount: 225,
    paidAt: "Apr 02, 2026",
  },
];

export const savedContractorIds = ["3", "1", "2", "4", "5", "6"];

export type Review = {
  id: string;
  contractor: string;
  job: string;
  completedAt: string;
  rating?: number;
  text?: string;
  reviewedAt?: string;
};

export const reviews: Review[] = [
  {
    id: "rev-1",
    contractor: "RoofGuard Pro",
    job: "Roof Leak Inspection",
    completedAt: "Jul 15, 2026",
  },
  {
    id: "rev-2",
    contractor: "Steel Plumbing Co.",
    job: "Kitchen Plumbing Repair",
    completedAt: "Jul 08, 2026",
    rating: 5,
    text: "John was fantastic! He fixed our kitchen leak quickly and professionally.",
    reviewedAt: "Jul 10, 2026",
  },
  {
    id: "rev-3",
    contractor: "Sentinel HVAC",
    job: "AC Maintenance",
    completedAt: "Jun 02, 2026",
    rating: 5,
    text: "Great service and very reliable. Arrived on time and completed the work as promised.",
    reviewedAt: "Jun 05, 2026",
  },
];

export type Message = {
  id: string;
  fromMe: boolean;
  text: string;
  time: string;
};

export type Conversation = {
  id: string;
  name: string;
  initials: string;
  project: string;
  online: boolean;
  unread: number;
  time: string;
  messages: Message[];
};

export const conversations: Conversation[] = [
  {
    id: "c-1",
    name: "Amelia Brooks",
    initials: "AB",
    project: "Deck Construction",
    online: true,
    unread: 2,
    time: "10:32 AM",
    messages: [
      {
        id: "m-1",
        fromMe: false,
        text: "Hi! Thanks for accepting my request.",
        time: "9:58 AM",
      },
      {
        id: "m-2",
        fromMe: true,
        text: "Of course — happy to help with the deck build.",
        time: "10:01 AM",
      },
      {
        id: "m-3",
        fromMe: false,
        text: "Do you typically use cedar or composite?",
        time: "10:04 AM",
      },
      {
        id: "m-4",
        fromMe: true,
        text: "Both work great. Cedar has a warmer look; composite is lower maintenance. I can bring samples.",
        time: "10:12 AM",
      },
      {
        id: "m-5",
        fromMe: false,
        text: "Sounds good — can we schedule a site visit Friday?",
        time: "10:32 AM",
      },
    ],
  },
  {
    id: "c-2",
    name: "Marcus Lee",
    initials: "ML",
    project: "Interior Painting",
    online: false,
    unread: 0,
    time: "9:14 AM",
    messages: [
      {
        id: "m-1",
        fromMe: true,
        text: "Here are the paint brands I usually work with.",
        time: "9:02 AM",
      },
      {
        id: "m-2",
        fromMe: false,
        text: "I sent over the color samples I liked.",
        time: "9:14 AM",
      },
    ],
  },
  {
    id: "c-3",
    name: "Jordan Rivera",
    initials: "JR",
    project: "Fence Install",
    online: false,
    unread: 0,
    time: "Yesterday",
    messages: [
      {
        id: "m-1",
        fromMe: true,
        text: "Your quote for the cedar fence is ready.",
        time: "Yesterday",
      },
      {
        id: "m-2",
        fromMe: false,
        text: "Thanks for the quote, reviewing now.",
        time: "Yesterday",
      },
    ],
  },
  {
    id: "c-4",
    name: "Nina Alvarez",
    initials: "NA",
    project: "Tile Repair",
    online: true,
    unread: 0,
    time: "Mon",
    messages: [
      {
        id: "m-1",
        fromMe: true,
        text: "I can start the tile repair Monday morning.",
        time: "Mon",
      },
      {
        id: "m-2",
        fromMe: false,
        text: "Perfect, see you Monday at 8am.",
        time: "Mon",
      },
    ],
  },
];

export const notifications = [
  {
    id: "n-1",
    title: "Quote accepted",
    text: "Steel Plumbing Co. accepted your service request.",
    time: "2 hrs ago",
    tone: "bg-[#16a34a]",
  },
  {
    id: "n-2",
    title: "New message",
    text: "Ironclad Electric sent you a message.",
    time: "5 hrs ago",
    tone: "bg-secondary-foreground",
  },
  {
    id: "n-3",
    title: "Invoice ready",
    text: "Your invoice #INV-1042 is ready for payment.",
    time: "1 day ago",
    tone: "bg-[#c92032]",
  },
  {
    id: "n-4",
    title: "Job completed",
    text: "AC Maintenance with Sentinel HVAC marked complete.",
    time: "3 days ago",
    tone: "bg-[#16a34a]",
  },
];

export const formatMoney = (amount: number) =>
  `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const formatMoneyShort = (amount: number) =>
  `$${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
