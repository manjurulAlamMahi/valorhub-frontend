import { useApi } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import {
  customerApi,
  type AppNotification,
  type Paged,
} from "@/services/customer";
import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

const BASE = "/contractor/dashboard";

const icons: Record<string, string> = {
  quote_request: "📋",
  quote_received: "📋",
  message: "💬",
  review: "⭐",
  invoice_paid: "💰",
  invoice_issued: "🧾",
  project: "🛠️",
};

// Where a notification leads, based on its type and payload
function hrefFor(item: AppNotification) {
  switch (item.type) {
    case "message":
      return item.data.conversation_id
        ? `${BASE}/messages?c=${String(item.data.conversation_id)}`
        : `${BASE}/messages`;
    case "quote_request":
    case "quote_received":
      return item.data.quote_request_id
        ? `${BASE}/quotes?lead=${String(item.data.quote_request_id)}`
        : `${BASE}/quotes`;
    case "invoice_paid":
    case "invoice_issued":
      return `${BASE}/invoices`;
    case "review":
      return `${BASE}/reviews`;
    case "project":
      return `${BASE}/projects`;
    default:
      return BASE;
  }
}

export default function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const query = useApi<Paged<AppNotification> & { unread_count: number }>(
    "/notifications",
    { per_page: 8 },
  );
  const { refetch } = query;
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const items = query.data?.items ?? [];
  const unread = query.data?.unread_count ?? 0;

  // No push channel yet, so the badge polls
  useEffect(() => {
    const timer = window.setInterval(refetch, 60_000);
    return () => window.clearInterval(timer);
  }, [refetch]);

  // Close on outside click and Escape
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const markAllRead = async () => {
    await customerApi.markAllNotificationsRead().catch(() => undefined);
    refetch();
  };

  const markRead = (item: AppNotification) => {
    if (item.is_read) return;
    void customerApi
      .markNotificationRead(item.id)
      .catch(() => undefined)
      .finally(refetch);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (!open) refetch();
          setOpen((prev) => !prev);
        }}
        aria-expanded={open}
        aria-controls="notifications-panel"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        className={cn(
          "relative rounded-lg p-2 text-[#64748b] hover:bg-[#f1f5f9]",
          {
            "bg-[#f1f5f9]": open,
          },
        )}
      >
        <Bell aria-hidden className="size-5" />
        {unread > 0 && (
          <span className="absolute top-1.5 left-5.5 size-2 rounded-full bg-[#c41e3a]" />
        )}
      </button>

      {open && (
        <div
          id="notifications-panel"
          role="dialog"
          aria-label="Notifications"
          className="absolute top-full right-0 z-40 mt-2 w-79.5 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_25px_25px_rgba(0,0,0,0.25)] max-sm:-right-14"
        >
          <div className="flex items-center justify-between border-b border-[#f1f5f9] px-4 py-3">
            <p className="text-sm leading-5 font-semibold text-[#0f172a]">
              Notifications
            </p>
            <button
              type="button"
              onClick={() => void markAllRead()}
              disabled={unread === 0}
              className="text-xs leading-4 font-medium text-[#64748b] hover:text-[#0f172a] disabled:opacity-50 disabled:hover:text-[#64748b]"
            >
              Mark all read
            </button>
          </div>
          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-[#64748b]">
              {query.error ? query.error.message : "You're all caught up."}
            </p>
          ) : (
            <ul className="max-h-96 overflow-y-auto">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="border-b border-[#e5e7eb] last:border-b-0"
                >
                  <Link
                    to={hrefFor(item)}
                    onClick={() => {
                      markRead(item);
                      setOpen(false);
                    }}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-[#f8fafc]"
                  >
                    <span
                      aria-hidden
                      className="w-4 shrink-0 pt-0.5 text-base leading-6"
                    >
                      {icons[item.type] ?? "🔔"}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs leading-4 font-semibold text-[#0f172a]">
                        {item.title}
                      </span>
                      <span className="block pt-0.5 text-xs leading-4 text-[#64748b]">
                        {item.body}
                      </span>
                      <span className="block pt-0.5 text-xs leading-4 text-[#94a3b8]">
                        {item.relative_time}
                      </span>
                    </span>
                    <span
                      className={cn("mt-1.5 size-2 shrink-0 rounded-full", {
                        "bg-[#c41e3a]": !item.is_read,
                      })}
                    >
                      {!item.is_read && <span className="sr-only">Unread</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
