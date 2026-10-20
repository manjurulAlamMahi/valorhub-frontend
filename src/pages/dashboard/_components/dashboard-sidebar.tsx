import UserAvatar from "@/components/shared/user-avatar";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router";
import { navigation } from "../data/dashboard";

export default function DashboardSidebar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const listRef = useRef<HTMLUListElement>(null);

  // On mobile the nav is a horizontal strip, so keep the active tab in view
  useEffect(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!list || !active || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: active.offsetLeft - 16, behavior: "smooth" });
  }, [pathname]);

  return (
    <aside className="bg-white lg:w-70 lg:shrink-0 lg:rounded-b-2xl">
      <div className="space-y-6 px-4 py-6 lg:px-6 lg:py-8">
        <div className="flex items-center gap-4 lg:flex-col lg:gap-2 lg:text-center">
          <UserAvatar
            name={user?.name ?? ""}
            src={user?.avatar}
            className="size-12 lg:size-16 lg:text-base"
          />
          <div className="leading-[normal]">
            <p className="text-base font-bold text-[#1e293b]">{user?.name}</p>
            <p className="pt-1 text-[13px] text-[#64748b] lg:pt-2">
              {user?.email}
            </p>
          </div>
        </div>

        <div className="bg-ring h-px max-lg:hidden" />

        <nav aria-label="Dashboard">
          <ul
            ref={listRef}
            className="relative flex gap-1 overflow-x-auto max-lg:-mx-4 max-lg:px-4 max-lg:pb-1 lg:flex-col"
          >
            {navigation.map((item) => (
              <li key={item.href} className="shrink-0">
                <NavLink
                  to={item.href}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] leading-[normal] whitespace-nowrap text-[#64748b] transition-colors hover:bg-[#f7f8fa] hover:text-[#1e293b]",
                      {
                        "bg-input font-medium text-[#c92032] hover:text-[#c92032]":
                          isActive,
                      },
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {!isActive && (
                        <span
                          aria-hidden
                          className="bg-ring size-1.5 rounded-full max-lg:hidden"
                        />
                      )}
                      {item.label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="bg-ring h-px max-lg:hidden" />

        <button
          type="button"
          onClick={() => void logout()}
          className="rounded-lg px-3 py-2.5 text-sm leading-[normal] font-medium text-[#64748b] hover:bg-[#f7f8fa] hover:text-[#1e293b] max-lg:hidden"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
