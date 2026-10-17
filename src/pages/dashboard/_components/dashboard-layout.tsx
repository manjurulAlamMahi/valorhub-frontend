import { SEO } from "@/components/seo/SEO";
import { useReducer } from "react";
import { Outlet } from "react-router";
import {
  DashboardContext,
  dashboardReducer,
  initialDashboardState,
} from "../data/dashboard-store";
import DashboardSidebar from "./dashboard-sidebar";

export default function DashboardLayout() {
  const [state, dispatch] = useReducer(dashboardReducer, initialDashboardState);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
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
    </DashboardContext.Provider>
  );
}
