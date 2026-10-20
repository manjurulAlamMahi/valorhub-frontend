// Navigation and status labels for the customer dashboard; data comes from /api/customer/*

const tone = {
  amber: "bg-[#f59e0b]/10 text-[#f59e0b]",
  navy: "bg-secondary-foreground/10 text-secondary-foreground",
  green: "bg-[#16a34a]/10 text-[#16a34a]",
  red: "bg-[#c92032]/10 text-[#c92032]",
  grey: "bg-[#64748b]/10 text-[#64748b]",
};

// Labels for the API's quote request, invoice and project statuses
export const statusStyles = {
  new: { label: "Awaiting quote", className: tone.amber },
  pending: { label: "Pending", className: tone.amber },
  quoted: { label: "Quote received", className: tone.navy },
  accepted: { label: "Accepted", className: tone.green },
  declined: { label: "Declined", className: tone.red },
  rejected: { label: "Declined", className: tone.red },
  expired: { label: "Expired", className: tone.grey },
  draft: { label: "Draft", className: tone.grey },
  paid: { label: "Paid", className: tone.green },
  overdue: { label: "Overdue", className: tone.red },
  in_progress: { label: "In Progress", className: tone.navy },
  completed: { label: "Completed", className: tone.green },
} as const;

export type StatusKey = keyof typeof statusStyles;

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
