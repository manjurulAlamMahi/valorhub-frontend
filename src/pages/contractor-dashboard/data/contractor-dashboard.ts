import {
  BadgeCheck,
  Building2,
  ClipboardList,
  FileText,
  Globe,
  Images,
  LayoutDashboard,
  MessageSquare,
  Package,
  PanelsTopLeft,
  Receipt,
  Settings,
  Star,
  BriefcaseBusiness,
  type LucideIcon,
} from "lucide-react";

const BASE = "/contractor/dashboard";
const IMAGES = "/images/contractor-dashboard";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  end?: boolean;
  count?: number;
  // Feature locked to a membership tier
  tier?: string;
};

export const navigation: NavItem[] = [
  { label: "Dashboard", href: BASE, icon: LayoutDashboard, end: true },
  { label: "Quote Requests", href: `${BASE}/quotes`, icon: FileText },
  { label: "Projects", href: `${BASE}/projects`, icon: ClipboardList },
  {
    label: "Messages",
    href: `${BASE}/messages`,
    icon: MessageSquare,
    count: 2,
  },
  { label: "Invoices", href: `${BASE}/invoices`, icon: Receipt },
  { label: "My Services", href: `${BASE}/services`, icon: BriefcaseBusiness },
  { label: "Products", href: `${BASE}/products`, icon: Package },
  { label: "Gallery", href: `${BASE}/gallery`, icon: Images },
  {
    label: "Banner",
    href: `${BASE}/banner`,
    icon: PanelsTopLeft,
    tier: "Elite",
  },
  { label: "Website", href: `${BASE}/website`, icon: Globe },
  { label: "Business Profile", href: `${BASE}/profile`, icon: Building2 },
  { label: "Reviews", href: `${BASE}/reviews`, icon: Star },
  { label: "Subscription", href: `${BASE}/subscription`, icon: BadgeCheck },
  { label: "Settings", href: `${BASE}/settings`, icon: Settings },
];

export const contractor = {
  name: "Marcus Rivera",
  firstName: "Marcus",
  business: "Iron Ridge Contracting",
  shortBusiness: "Iron Ridge Co.",
  location: "Austin, TX",
  memberSince: 2023,
  tier: "Elite",
  avatar: `${IMAGES}/marcus.png`,
};

export const quickActions = [
  { label: "Create Quote", href: `${BASE}/quotes` },
  { label: "Create Invoice", href: `${BASE}/invoices` },
  { label: "Add Service", href: `${BASE}/services` },
];

export type StatTone =
  "blue" | "green" | "amber" | "violet" | "rating" | "pink";

export const stats: {
  value: string;
  label: string;
  note: string;
  tone: StatTone;
  href: string;
}[] = [
  {
    value: "7",
    label: "New Quote Requests",
    note: "+3 this week",
    tone: "blue",
    href: `${BASE}/quotes`,
  },
  {
    value: "4",
    label: "Active Projects",
    note: "2 due this week",
    tone: "green",
    href: `${BASE}/projects`,
  },
  {
    value: "$8,450",
    label: "Pending Invoices",
    note: "3 invoices pending",
    tone: "amber",
    href: `${BASE}/invoices`,
  },
  {
    value: "$24,620",
    label: "Monthly Revenue",
    note: "+12% vs last month",
    tone: "violet",
    href: `${BASE}/invoices`,
  },
  {
    value: "4.9",
    label: "Average Rating",
    note: "Based on 87 reviews",
    tone: "rating",
    href: `${BASE}/reviews`,
  },
  {
    value: "5",
    label: "Pending Quotes",
    note: "Awaiting response",
    tone: "pink",
    href: `${BASE}/quotes`,
  },
];

export type Status = "green" | "blue" | "orange" | "red";

export type ProjectStatus =
  "in_progress" | "started" | "completed" | "cancelled";

export const projectStatuses: Record<
  ProjectStatus,
  { label: string; tone: Status }
> = {
  in_progress: { label: "In Progress", tone: "orange" },
  started: { label: "Started", tone: "green" },
  completed: { label: "Completed", tone: "blue" },
  cancelled: { label: "Cancelled", tone: "red" },
};

export const projects: {
  id: string;
  title: string;
  client: string;
  due: string;
  status: ProjectStatus;
  progress: number;
}[] = [
  {
    id: "1",
    title: "Henderson Kitchen Remodel",
    client: "Robert Henderson",
    due: "Aug 15, 2026",
    status: "in_progress",
    progress: 72,
  },
  {
    id: "2",
    title: "Park Ave Deck Build",
    client: "Tanya Williams",
    due: "Aug 28, 2026",
    status: "in_progress",
    progress: 40,
  },
  {
    id: "3",
    title: "Cedar Park Bathroom",
    client: "Mike Danforth",
    due: "Sep 5, 2026",
    status: "started",
    progress: 15,
  },
];

export const messages = [
  {
    id: "1",
    name: "Sarah Mitchell",
    avatar: `${IMAGES}/sarah.png`,
    time: "2h ago",
    text: "Can you come for a site visit on Thursday?",
    unread: true,
  },
  {
    id: "2",
    name: "David Okonkwo",
    avatar: `${IMAGES}/david.png`,
    time: "4h ago",
    text: "Thanks for the quote, looks good to me.",
    unread: true,
  },
  {
    id: "3",
    name: "James Torres",
    avatar: `${IMAGES}/james.png`,
    time: "Yesterday",
    text: "Project update: foundation work complete.",
    unread: false,
  },
];

export type QuoteStatus = "new" | "pending" | "accepted" | "rejected";

export const quoteStatuses: Record<
  QuoteStatus,
  { label: string; tone: Status }
> = {
  new: { label: "New", tone: "blue" },
  pending: { label: "Pending", tone: "orange" },
  accepted: { label: "Accepted", tone: "green" },
  rejected: { label: "Rejected", tone: "red" },
};

export const quoteRequests: {
  id: string;
  name: string;
  avatar: string;
  status: QuoteStatus;
  service: string;
  location: string;
  budget: string;
  date: string;
}[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    avatar: `${IMAGES}/sarah.png`,
    status: "new",
    service: "Kitchen Remodel",
    location: "Austin, TX",
    budget: "$12,000–18,000",
    date: "Jul 30, 2026",
  },
  {
    id: "2",
    name: "David Okonkwo",
    avatar: `${IMAGES}/david.png`,
    status: "pending",
    service: "Deck Installation",
    location: "Round Rock, TX",
    budget: "$6,500–9,000",
    date: "Jul 29, 2026",
  },
  {
    id: "3",
    name: "Lisa Chen",
    avatar: `${IMAGES}/james.png`,
    status: "accepted",
    service: "Bathroom Renovation",
    location: "Cedar Park, TX",
    budget: "$8,000–11,000",
    date: "Jul 28, 2026",
  },
  {
    id: "4",
    name: "Tom Barnett",
    avatar: `${IMAGES}/sarah.png`,
    status: "rejected",
    service: "Fence Installation",
    location: "Pflugerville, TX",
    budget: "$2,800–4,200",
    date: "Jul 26, 2026",
  },
  {
    id: "5",
    name: "Nina Russo",
    avatar: `${IMAGES}/james.png`,
    status: "pending",
    service: "HVAC Replacement",
    location: "Buda, TX",
    budget: "$7,000–10,000",
    date: "Jul 25, 2026",
  },
  {
    id: "6",
    name: "Brian Collins",
    avatar: `${IMAGES}/david.png`,
    status: "accepted",
    service: "Roof Repair",
    location: "Kyle, TX",
    budget: "$3,000–5,000",
    date: "Jul 23, 2026",
  },
];

export const reviews = [
  {
    id: "1",
    name: "Emily Patel",
    avatar: `${IMAGES}/emily.jpg`,
    date: "Jul 28, 2026",
    rating: 5,
    text: "Marcus and his crew were exceptional. Clean, professional, on-time. Highly recommend Iron Ridge.",
    project: "Master Bathroom Remodel",
  },
  {
    id: "2",
    name: "Carlos Benitez",
    avatar: `${IMAGES}/carlos.jpg`,
    date: "Jul 22, 2026",
    rating: 5,
    text: "Outstanding craftsmanship on our deck build. Will absolutely hire again.",
    project: "Backyard Deck Build",
  },
];

export const notifications = [
  {
    id: "1",
    icon: "📋",
    title: "New Quote Request",
    text: "Sarah Mitchell requested a kitchen remodel quote.",
    time: "2h ago",
    href: `${BASE}/quotes`,
    unread: true,
  },
  {
    id: "2",
    icon: "💬",
    title: "New Message",
    text: "David Okonkwo: Thanks for the quote, looks good!",
    time: "4h ago",
    href: `${BASE}/messages`,
    unread: true,
  },
  {
    id: "3",
    icon: "⭐",
    title: "New Review",
    text: "Emily Patel left you a 5-star review.",
    time: "Yesterday",
    href: `${BASE}/reviews`,
    unread: false,
  },
  {
    id: "4",
    icon: "💰",
    title: "Invoice Paid",
    text: "Patricia Nguyen paid Invoice INV-2039 ($3,800).",
    time: "Jul 30",
    href: `${BASE}/invoices`,
    unread: false,
  },
];

export const starIcon = `${IMAGES}/star.png`;
