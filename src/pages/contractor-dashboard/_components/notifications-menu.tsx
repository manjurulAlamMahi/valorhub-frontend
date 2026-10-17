import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { notifications as initialNotifications } from "../data/contractor-dashboard";

export default function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initialNotifications);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const unread = items.filter((item) => item.unread).length;

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

  const markRead = (id?: string) =>
    setItems((prev) =>
      prev.map((item) =>
        !id || item.id === id ? { ...item, unread: false } : item,
      ),
    );

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
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
              onClick={() => markRead()}
              disabled={unread === 0}
              className="text-xs leading-4 font-medium text-[#64748b] hover:text-[#0f172a] disabled:opacity-50 disabled:hover:text-[#64748b]"
            >
              Mark all read
            </button>
          </div>
          <ul>
            {items.map((item) => (
              <li
                key={item.id}
                className="border-b border-[#e5e7eb] last:border-b-0"
              >
                <Link
                  to={item.href}
                  onClick={() => {
                    markRead(item.id);
                    setOpen(false);
                  }}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-[#f8fafc]"
                >
                  <span
                    aria-hidden
                    className="w-4 shrink-0 pt-0.5 text-base leading-6"
                  >
                    {item.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs leading-4 font-semibold text-[#0f172a]">
                      {item.title}
                    </span>
                    <span className="block pt-0.5 text-xs leading-4 text-[#64748b]">
                      {item.text}
                    </span>
                    <span className="block pt-0.5 text-xs leading-4 text-[#94a3b8]">
                      {item.time}
                    </span>
                  </span>
                  <span
                    className={cn("mt-1.5 size-2 shrink-0 rounded-full", {
                      "bg-[#c41e3a]": item.unread,
                    })}
                  >
                    {item.unread && <span className="sr-only">Unread</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
