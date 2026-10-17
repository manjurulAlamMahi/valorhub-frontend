import { Menu } from "lucide-react";
import { useState } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router";
import { contractor, navigation } from "../data/contractor-dashboard";
import DashboardSidebar from "./dashboard-sidebar";
import NotificationsMenu from "./notifications-menu";
import TierBadge from "./tier-badge";

export default function ContractorLayout() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);

  // Longest matching href wins so nested pages keep their section title
  const current = [...navigation]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => pathname.startsWith(item.href));

  const invoiceId = pathname.match(/\/invoices\/(INV-[\w-]+)$/)?.[1];
  const pageTitle = pathname.endsWith("/invoices/new")
    ? "New Invoice"
    : invoiceId
      ? `Invoice #${invoiceId}`
      : (current?.label ?? "Dashboard");

  return (
    <div className="flex min-h-svh bg-[#f8fafc]">
      <ScrollRestoration />
      <DashboardSidebar
        collapsed={collapsed}
        open={open}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
        onClose={() => setOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[#e2e8f0] bg-white px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-controls="contractor-sidebar"
            aria-expanded={open}
            className="-ml-1 rounded-lg p-1.5 text-[#0f172a] hover:bg-[#f1f5f9] lg:hidden"
          >
            <Menu aria-hidden className="size-5" />
          </button>
          <p className="min-w-0 flex-1 truncate text-base leading-6 font-semibold text-[#0f172a]">
            {pageTitle}
          </p>

          <div className="flex items-center gap-3">
            <NotificationsMenu />
            <div className="flex items-center gap-2.5 border-l border-[#efefef] pl-3">
              <img
                src={contractor.avatar}
                alt=""
                className="size-8 rounded-full object-cover"
              />
              <div className="max-sm:hidden">
                <div className="flex items-start gap-1.5">
                  <p className="text-sm leading-5 font-semibold text-[#0f172a]">
                    {contractor.name}
                  </p>
                  <TierBadge label={contractor.tier} />
                </div>
                <p className="text-xs leading-4 text-[#64748b]">
                  {contractor.shortBusiness}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
