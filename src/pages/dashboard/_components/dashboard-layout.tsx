import { SEO } from "@/components/seo/SEO";
import { Outlet } from "react-router";
import DashboardSidebar from "./dashboard-sidebar";

export default function DashboardLayout() {
  return (
    <>
      <SEO
        title="My Dashboard"
        description="Manage your ValorHub service requests, quotes, invoices, and messages."
        robots="noindex, nofollow"
      />
      <main className="flex flex-col bg-[#f8fafc] lg:flex-row">
        <DashboardSidebar />
        <div className="min-w-0 flex-1 px-4 pt-6 pb-12 lg:px-8 lg:pt-8 lg:pb-19">
          <Outlet />
        </div>
      </main>
    </>
  );
}
