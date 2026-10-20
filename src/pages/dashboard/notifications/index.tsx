import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  customerApi,
  type AppNotification,
  type Paged,
} from "@/services/customer";
import { BellOff } from "lucide-react";
import { useState } from "react";
import DashboardPage from "../_components/dashboard-page";
import QueryBoundary from "@/components/shared/query-boundary";

type NotificationsData = Paged<AppNotification> & { unread_count: number };

// Dot colour by notification type
const tones: Record<string, string> = {
  quote: "bg-secondary-foreground",
  quote_received: "bg-secondary-foreground",
  message: "bg-[#2b7fff]",
  invoice: "bg-[#f59e0b]",
  invoice_paid: "bg-[#16a34a]",
  review: "bg-[#c92032]",
};

export default function Notifications() {
  const query = useApi<NotificationsData>("/notifications", { per_page: 50 });
  const [error, setError] = useState("");

  const run = async (task: () => Promise<unknown>) => {
    setError("");
    try {
      await task();
      query.refetch();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    }
  };

  const items = query.data?.items ?? [];
  const unread = query.data?.unread_count ?? 0;

  return (
    <DashboardPage
      title="Notifications"
      description="Stay updated on your requests, quotes, and messages."
      action={
        items.length > 0 && (
          <div className="flex shrink-0 gap-4">
            {unread > 0 && (
              <button
                type="button"
                onClick={() => void run(customerApi.markAllNotificationsRead)}
                className="text-sm leading-[normal] font-medium text-[#64748b] hover:underline"
              >
                Mark all as read
              </button>
            )}
            <button
              type="button"
              onClick={() => void run(customerApi.clearNotifications)}
              className="text-sm leading-[normal] font-medium text-[#c92032] hover:underline"
            >
              Clear all
            </button>
          </div>
        )
      }
    >
      {error && (
        <p role="alert" className="text-sm text-[#c92032]">
          {error}
        </p>
      )}
      <QueryBoundary query={query}>
        {() =>
          items.length > 0 ? (
            <ul className="space-y-3 leading-[normal]">
              {items.map((notification) => (
                <li key={notification.id}>
                  <button
                    type="button"
                    disabled={notification.is_read}
                    onClick={() =>
                      void run(() =>
                        customerApi.markNotificationRead(notification.id),
                      )
                    }
                    aria-label={
                      notification.is_read
                        ? undefined
                        : `${notification.title} (unread, mark as read)`
                    }
                    className={cn(
                      "flex w-full items-center gap-3.5 rounded-xl border border-[#e6eaf2] bg-white p-4 text-left disabled:cursor-default",
                      {
                        "border-secondary-foreground/30": !notification.is_read,
                      },
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "size-2.5 shrink-0 rounded-full",
                        tones[notification.type] ?? "bg-[#94a3b8]",
                        { "opacity-30": notification.is_read },
                      )}
                    />
                    <span className="min-w-0 flex-1 space-y-0.5">
                      <span
                        className={cn("block text-sm text-[#1e293b]", {
                          "font-semibold": !notification.is_read,
                          "font-medium": notification.is_read,
                        })}
                      >
                        {notification.title}
                      </span>
                      <span className="block text-[13px] text-[#64748b]">
                        {notification.body}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-[#64748b]">
                      {notification.relative_time}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-[#e6eaf2] bg-white p-10 text-center">
              <BellOff aria-hidden className="size-8 text-[#94a3b8]" />
              <p className="text-sm text-[#64748b]">You're all caught up.</p>
            </div>
          )
        }
      </QueryBoundary>
    </DashboardPage>
  );
}
