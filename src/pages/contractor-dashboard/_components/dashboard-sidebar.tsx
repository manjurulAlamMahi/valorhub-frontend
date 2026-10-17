import { cn } from "@/lib/utils";
import { ChevronLeft, X } from "lucide-react";
import { Link, NavLink } from "react-router";
import { contractor, navigation } from "../data/contractor-dashboard";
import SidebarLogo from "./sidebar-logo";

type DashboardSidebarProps = {
  collapsed: boolean;
  open: boolean;
  onToggleCollapse: () => void;
  onClose: () => void;
};

export default function DashboardSidebar({
  collapsed,
  open,
  onToggleCollapse,
  onClose,
}: DashboardSidebarProps) {
  return (
    <>
      {open && (
        <div
          aria-hidden
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#0f172a]/40 lg:hidden"
        />
      )}
      <aside
        id="contractor-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-white/7 bg-[#211d53] transition-[width,translate] duration-200 lg:sticky lg:top-0 lg:h-svh lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
          { "lg:w-18": collapsed },
        )}
      >
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/7 px-4">
          <Link
            to="/"
            className={cn({ "lg:hidden": collapsed })}
            aria-label="ValorHub home"
          >
            <SidebarLogo />
          </Link>
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="ml-auto rounded p-1 text-white opacity-40 hover:opacity-80 max-lg:hidden"
          >
            <ChevronLeft
              aria-hidden
              className={cn("size-4 transition-transform", {
                "rotate-180": collapsed,
              })}
            />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="ml-auto rounded p-1 text-white opacity-60 hover:opacity-100 lg:hidden"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>

        <nav
          aria-label="Contractor dashboard"
          className="flex-1 overflow-y-auto px-2 py-4"
        >
          <ul className="space-y-0.5">
            {navigation.map(({ label, href, icon: Icon, end, count, tier }) => (
              <li key={href}>
                <NavLink
                  to={href}
                  end={end}
                  onClick={onClose}
                  title={collapsed ? label : undefined}
                  className={({ isActive }) =>
                    cn(
                      "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm leading-5 font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white/80",
                      {
                        "bg-[#c41e3a]/15 text-white before:absolute before:top-2.5 before:left-0 before:h-5 before:w-0.5 before:rounded-r before:bg-[#c41e3a] hover:bg-[#c41e3a]/15 hover:text-white":
                          isActive,
                        "lg:justify-center": collapsed,
                      },
                    )
                  }
                >
                  <Icon aria-hidden className="size-4.5 shrink-0" />
                  <span className={cn("flex-1", { "lg:sr-only": collapsed })}>
                    {label}
                  </span>
                  {count ? (
                    <span
                      className={cn(
                        "rounded-full bg-[#c41e3a] px-1.5 py-0.5 text-xs leading-4 font-semibold text-white",
                        {
                          "lg:absolute lg:top-1 lg:right-1 lg:px-1 lg:py-0 lg:text-[10px]":
                            collapsed,
                        },
                      )}
                    >
                      <span className="sr-only">, </span>
                      {count}
                      <span className="sr-only"> unread</span>
                    </span>
                  ) : null}
                  {tier && (
                    <span
                      className={cn(
                        "rounded-full bg-[#c41e3a]/20 px-1.5 py-0.5 text-xs leading-4 font-semibold text-[#f87171]",
                        { "lg:hidden": collapsed },
                      )}
                    >
                      {tier}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-white/7 p-3">
          <div
            className={cn("flex items-center gap-3 rounded-lg p-2", {
              "lg:justify-center lg:p-0": collapsed,
            })}
          >
            <img
              src={contractor.avatar}
              alt=""
              className="size-8 shrink-0 rounded-full object-cover"
            />
            <div className={cn("min-w-0", { "lg:hidden": collapsed })}>
              <p className="truncate text-sm leading-5 font-semibold text-white">
                {contractor.name}
              </p>
              <p className="truncate text-xs leading-4 text-white/45">
                {contractor.business}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
