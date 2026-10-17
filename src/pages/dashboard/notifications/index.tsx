import { cn } from "@/lib/utils";
import { BellOff } from "lucide-react";
import DashboardPage from "../_components/dashboard-page";
import { useDashboard } from "../data/dashboard-store";

export default function Notifications() {
  const { state, dispatch } = useDashboard();
  const items = state.notifications;

  return (
    <DashboardPage
      title="Notifications"
      description="Stay updated on your requests, quotes, and messages."
      action={
        items.length > 0 && (
          <button
            type="button"
            onClick={() => dispatch({ type: "clearNotifications" })}
            className="shrink-0 text-sm leading-[normal] font-medium text-[#c92032] hover:underline"
          >
            Clear all
          </button>
        )
      }
    >
      {items.length > 0 ? (
        <ul className="space-y-3 leading-[normal]">
          {items.map((notification) => (
            <li
              key={notification.id}
              className="flex items-center gap-3.5 rounded-xl border border-[#e6eaf2] bg-white p-4"
            >
              <span
                aria-hidden
                className={cn(
                  "size-2.5 shrink-0 rounded-full",
                  notification.tone,
                )}
              />
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-sm font-medium text-[#1e293b]">
                  {notification.title}
                </p>
                <p className="text-[13px] text-[#64748b]">
                  {notification.text}
                </p>
              </div>
              <p className="shrink-0 text-xs text-[#64748b]">
                {notification.time}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-[#e6eaf2] bg-white p-10 text-center">
          <BellOff aria-hidden className="size-8 text-[#94a3b8]" />
          <p className="text-sm text-[#64748b]">You're all caught up.</p>
        </div>
      )}
    </DashboardPage>
  );
}
