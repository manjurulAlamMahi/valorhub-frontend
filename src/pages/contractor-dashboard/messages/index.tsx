import { SEO } from "@/components/seo/SEO";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  FileText,
  ImageIcon,
  Paperclip,
  Search,
  SendHorizontal,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { conversations as initialConversations } from "../data/messages";

const now = () =>
  `Today ${new Date()
    .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    .replace(" ", "")
    .toLowerCase()}`;

const attachOption =
  "flex cursor-pointer flex-col items-center gap-1 rounded-lg px-4 py-3 text-xs leading-4 font-medium text-[#374151] hover:bg-[#f8fafc]";

function Avatar({ initials, small }: { initials: string; small?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-content-center rounded-full bg-[#1b3a6b] text-xs leading-4 font-bold text-white",
        small ? "size-7" : "size-9",
      )}
    >
      {initials}
    </span>
  );
}

export default function Messages() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState(initialConversations[0].id);
  // On small screens the list and the thread are shown one at a time
  const [showThread, setShowThread] = useState(false);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [attachOpen, setAttachOpen] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const attachRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((item) => item.id === activeId)!;
  const search = query.trim().toLowerCase();
  const visible = conversations.filter(
    (item) =>
      !search ||
      item.name.toLowerCase().includes(search) ||
      item.project.toLowerCase().includes(search),
  );

  // Keep the newest message in view
  useEffect(() => {
    const thread = threadRef.current;
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [activeId, active.messages.length]);

  useEffect(() => {
    if (!attachOpen) return;
    const close = (event: PointerEvent | KeyboardEvent) => {
      if (
        event instanceof KeyboardEvent
          ? event.key === "Escape"
          : !attachRef.current?.contains(event.target as Node)
      )
        setAttachOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [attachOpen]);

  const open = (id: string) => {
    setActiveId(id);
    setShowThread(true);
    setConversations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: 0 } : item)),
    );
  };

  const send = (text: string) => {
    setConversations((prev) =>
      prev.map((item) =>
        item.id === activeId
          ? {
              ...item,
              time: "Just now",
              // Replying marks the conversation as read
              unread: 0,
              messages: [
                ...item.messages,
                { id: crypto.randomUUID(), from: "me", text, time: now() },
              ],
            }
          : item,
      ),
    );
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    send(text);
    setDraft("");
  };

  const attach = (files: FileList | null) => {
    if (!files?.length) return;
    send(Array.from(files, (file) => `📎 ${file.name}`).join("\n"));
    setAttachOpen(false);
  };

  return (
    <>
      <SEO
        title="Messages"
        description="Chat with your ValorHub customers."
        robots="noindex, nofollow"
      />

      <div className="flex h-[calc(100svh-4rem)] min-h-120">
        <section
          aria-label="Conversations"
          className={cn(
            "flex w-full flex-col border-r border-[#e2e8f0] bg-white md:w-72 md:shrink-0",
            { "max-md:hidden": showThread },
          )}
        >
          <div className="border-b border-[#f1f5f9] p-4">
            <div className="relative">
              <Search
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#0f172a]/50"
              />
              <label htmlFor="conversation-search" className="sr-only">
                Search conversations
              </label>
              <input
                id="conversation-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search conversations…"
                className="h-9.5 w-full rounded-lg border border-[#e2e8f0] pr-4 pl-9 text-sm text-[#0f172a] outline-none placeholder:text-[#0f172a]/50 focus:border-[#262262]/40 focus:ring-3 focus:ring-[#262262]/10"
              />
            </div>
          </div>

          <ul className="flex-1 overflow-y-auto">
            {visible.map((item) => {
              const last = item.messages[item.messages.length - 1];
              const selected = item.id === activeId;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => open(item.id)}
                    aria-current={selected ? "true" : undefined}
                    className={cn(
                      "flex w-full items-start gap-3 border-b border-[#0f172a]/6 px-4 py-3.5 text-left transition-colors hover:bg-[#f8fafc]",
                      { "bg-[#f0f7ff] hover:bg-[#f0f7ff]": selected },
                    )}
                  >
                    <span className="relative">
                      <Avatar initials={item.initials} />
                      {item.unread > 0 && (
                        <span className="absolute -top-1 left-6 grid size-4 place-content-center rounded-full bg-[#c41e3a] text-[10px] leading-[15px] font-bold text-white">
                          {item.unread}
                          <span className="sr-only"> unread</span>
                        </span>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-1">
                        <span className="truncate text-sm leading-5 font-semibold text-[#0f172a]">
                          {item.name}
                        </span>
                        <span className="shrink-0 text-xs leading-4 text-[#94a3b8]">
                          {item.time}
                        </span>
                      </span>
                      <span className="block text-xs leading-4 text-[#64748b]">
                        {item.project}
                      </span>
                      <span
                        className={cn(
                          "block truncate pt-0.5 text-xs leading-4",
                          item.unread > 0
                            ? "font-medium text-[#374151]"
                            : "text-[#94a3b8]",
                        )}
                      >
                        {last.from === "me" && item.unread === 0 && selected
                          ? `You: ${last.text}`
                          : last.text}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
            {visible.length === 0 && (
              <li className="p-6 text-center text-sm text-[#64748b]">
                No conversations found.
              </li>
            )}
          </ul>
        </section>

        <section
          aria-label={`Conversation with ${active.name}`}
          className={cn("flex min-w-0 flex-1 flex-col", {
            "max-md:hidden": !showThread,
          })}
        >
          <div className="flex items-center gap-3 border-b border-[#e2e8f0] bg-white px-4 py-3.5 sm:px-5">
            <button
              type="button"
              onClick={() => setShowThread(false)}
              aria-label="Back to conversations"
              className="-ml-1 rounded-lg p-1 text-[#64748b] hover:bg-[#f1f5f9] md:hidden"
            >
              <ChevronLeft aria-hidden className="size-5" />
            </button>
            <Avatar initials={active.initials} />
            <div className="min-w-0">
              <p className="truncate text-sm leading-5 font-semibold text-[#0f172a]">
                {active.name}
              </p>
              <p className="truncate text-xs leading-4 text-[#64748b]">
                {active.project}
              </p>
            </div>
          </div>

          <div
            ref={threadRef}
            role="log"
            aria-live="polite"
            className="flex-1 space-y-4 overflow-y-auto bg-[#f8fafc] p-4 sm:p-5"
          >
            {active.messages.map((message) =>
              message.from === "me" ? (
                <div
                  key={message.id}
                  className="ml-auto w-fit max-w-[min(28rem,85%)]"
                >
                  <p className="rounded-2xl rounded-br-sm bg-[#262262] px-4 py-2.5 text-sm leading-5 whitespace-pre-line text-white">
                    {message.text}
                  </p>
                  <p className="pt-1 text-right text-xs leading-4 text-[#94a3b8]">
                    {message.time}
                  </p>
                </div>
              ) : (
                <div key={message.id} className="flex items-end gap-2">
                  <span className="pb-5">
                    <Avatar initials={active.initials} small />
                  </span>
                  <div className="w-fit max-w-[min(28rem,80%)]">
                    <p className="rounded-2xl rounded-bl-sm bg-white px-4 py-2.5 text-sm leading-5 whitespace-pre-line text-[#0f172a] shadow-[0_1px_1.5px_rgba(0,0,0,0.06)]">
                      {message.text}
                    </p>
                    <p className="pt-1 text-xs leading-4 text-[#94a3b8]">
                      {message.time}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 border-t border-[#e2e8f0] bg-white px-4 py-4 sm:px-5"
          >
            <div ref={attachRef} className="relative">
              <button
                type="button"
                onClick={() => setAttachOpen((prev) => !prev)}
                aria-label="Attach"
                aria-expanded={attachOpen}
                aria-controls="attach-menu"
                className={cn(
                  "rounded-lg p-2 text-[#64748b] hover:bg-[#f1f5f9]",
                  {
                    "bg-[#f1f5f9] text-[#262262]": attachOpen,
                  },
                )}
              >
                <Paperclip aria-hidden className="size-5" />
              </button>
              {attachOpen && (
                <div
                  id="attach-menu"
                  className="absolute bottom-full left-0 mb-4 flex gap-2 rounded-xl border border-[#e2e8f0] bg-white p-2 shadow-[0_10px_7.5px_rgba(0,0,0,0.1),0_4px_3px_rgba(0,0,0,0.1)]"
                >
                  {[
                    { label: "Photo", icon: ImageIcon, accept: "image/*" },
                    { label: "File", icon: Paperclip, accept: undefined },
                  ].map(({ label, icon: Icon, accept }) => (
                    <label
                      key={label}
                      className={cn(
                        attachOption,
                        "focus-within:ring-3 focus-within:ring-[#262262]/20",
                      )}
                    >
                      <input
                        type="file"
                        accept={accept}
                        multiple
                        onChange={(event) => {
                          attach(event.target.files);
                          event.target.value = "";
                        }}
                        className="sr-only"
                      />
                      <Icon aria-hidden className="size-5" />
                      {label}
                    </label>
                  ))}
                  <button
                    type="button"
                    onClick={() => navigate("/contractor/dashboard/quotes")}
                    className={attachOption}
                  >
                    <FileText aria-hidden className="size-5" />
                    Quote
                  </button>
                </div>
              )}
            </div>
            <label htmlFor="message-input" className="sr-only">
              Message {active.name}
            </label>
            <input
              id="message-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type a message…"
              autoComplete="off"
              className="h-10.5 min-w-0 flex-1 rounded-xl border border-[#e2e8f0] px-4 text-sm text-[#0f172a] outline-none placeholder:text-[#0f172a]/50 focus:border-[#262262]/40 focus:ring-3 focus:ring-[#262262]/10"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={!draft.trim()}
              className="rounded-xl bg-[#262262] p-2.5 text-white transition-opacity hover:bg-[#211d53] disabled:opacity-60"
            >
              <SendHorizontal aria-hidden className="size-4" />
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
