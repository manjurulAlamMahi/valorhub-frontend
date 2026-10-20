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
  // Unread badge, filled in by the sidebar from the API
  count?: number;
  // Feature locked to a membership tier
  tier?: string;
};

export const navigation: NavItem[] = [
  { label: "Dashboard", href: BASE, icon: LayoutDashboard, end: true },
  { label: "Quote Requests", href: `${BASE}/quotes`, icon: FileText },
  { label: "Projects", href: `${BASE}/projects`, icon: ClipboardList },
  { label: "Messages", href: `${BASE}/messages`, icon: MessageSquare },
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

export const quickActions = [
  { label: "Create Quote", href: `${BASE}/quotes` },
  { label: "Create Invoice", href: `${BASE}/invoices/new` },
  { label: "Add Service", href: `${BASE}/services` },
];

export type Status = "green" | "blue" | "orange" | "red";

// Labels for the API's quote request (lead) statuses
export const leadStatuses: Record<string, { label: string; tone: Status }> = {
  new: { label: "New", tone: "blue" },
  pending: { label: "New", tone: "blue" },
  quoted: { label: "Quote Sent", tone: "orange" },
  accepted: { label: "Accepted", tone: "green" },
  declined: { label: "Declined", tone: "red" },
  rejected: { label: "Rejected", tone: "red" },
  expired: { label: "Expired", tone: "red" },
};

// Labels for the API's project statuses
export const projectStatuses: Record<string, { label: string; tone: Status }> =
  {
    in_progress: { label: "In Progress", tone: "orange" },
    scheduled: { label: "Scheduled", tone: "green" },
    pending_materials: { label: "Pending Materials", tone: "orange" },
    completed: { label: "Completed", tone: "blue" },
    cancelled: { label: "Cancelled", tone: "red" },
  };

export const starIcon = `${IMAGES}/star.png`;
