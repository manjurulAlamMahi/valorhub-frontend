import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  EllipsisVertical,
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import DashboardPage from "../_components/dashboard-page";
import type { Conversation } from "../data/dashboard";
import { useDashboard } from "../data/dashboard-store";

function Avatar({
  conversation,
  size = "size-11",
}: {
  conversation: Conversation;
  size?: string;
}) {
  return (
    <span className="relative shrink-0">
      <span
        className={cn(
          "grid place-content-center rounded-full bg-[#25215e]/10 text-base leading-6 font-semibold text-[#25215e]",
          size,
        )}
      >
        {conversation.initials}
      </span>
      {conversation.online && (
        <span className="absolute right-0 bottom-0 size-3 rounded-full bg-[#29a36a] ring-2 ring-white" />
      )}
    </span>
  );
}

export default function Inbox() {
  const { state, dispatch } = useDashboard();
  const [activeId, setActiveId] = useState(state.conversations[0]?.id);
  const [showThread, setShowThread] = useState(false);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);

  const active = state.conversations.find((c) => c.id === activeId);
  const filtered = state.conversations.filter((conversation) =>
    `${conversation.name} ${conversation.project}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [active?.messages.length, activeId]);

  const open = (id: string) => {
    setActiveId(id);
    setShowThread(true);
    dispatch({ type: "readConversation", conversationId: id });
  };

  const send = (event: FormEvent) => {
    event.preventDefault();
    if (!active || !draft.trim()) return;
    dispatch({
      type: "sendMessage",
      conversationId: active.id,
      text: draft.trim(),
    });
    setDraft("");
  };

  return (
    <DashboardPage
      title="Inbox"
      description="Messages with contractors about your projects."
    >
      <div className="flex h-133.5 overflow-hidden rounded-2xl border border-[#e6eaf2] bg-white">
        <div
          className={cn(
            "flex w-full flex-col border-[#e1e4ea] md:w-80 md:shrink-0 md:border-r",
            { "max-md:hidden": showThread },
          )}
        >
          <div className="space-y-3 border-b border-[#e1e4ea] p-4">
            <h2 className="font-mono text-base leading-6 font-bold text-[#110f2e]">
              Conversations
            </h2>
            <label className="flex h-10 items-center gap-2 rounded-[13.6px] bg-[#f3f4f7]/60 px-3">
              <Search aria-hidden className="size-4 text-[#9ca3af]" />
              <span className="sr-only">Search conversations</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search…"
                className="min-w-0 flex-1 bg-transparent text-sm text-[#110f2e] outline-none placeholder:text-[#9ca3af]"
              />
            </label>
          </div>

          <ul className="flex-1 overflow-y-auto">
            {filtered.map((conversation) => {
              const last = conversation.messages.at(-1);
              return (
                <li key={conversation.id}>
                  <button
                    type="button"
                    onClick={() => open(conversation.id)}
                    aria-current={
                      conversation.id === activeId ? "true" : undefined
                    }
                    className={cn(
                      "flex w-full items-start gap-3 border-b border-[#e1e4ea] px-4 pt-3 pb-3.25 text-left transition-colors hover:bg-[#efeffb]/40",
                      { "bg-[#efeffb]/60": conversation.id === activeId },
                    )}
                  >
                    <Avatar conversation={conversation} />
                    <span className="min-w-0 flex-1 space-y-0.5">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm leading-5 font-semibold text-[#110f2e]">
                          {conversation.name}
                        </span>
                        <span className="shrink-0 text-[11px] leading-4 text-[#6a7181]">
                          {conversation.time}
                        </span>
                      </span>
                      <span className="block text-xs leading-4 text-[#25215e]">
                        {conversation.project}
                      </span>
                      <span className="line-clamp-2 text-sm leading-5 text-[#6a7181]">
                        {last?.text}
                      </span>
                    </span>
                    {conversation.unread > 0 && (
                      <span className="mt-1 grid h-5 min-w-5 place-content-center rounded-full bg-[#25215e] px-1.5 text-[11px] font-bold text-white">
                        {conversation.unread}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="p-6 text-center text-sm text-[#6a7181]">
                No conversations found.
              </li>
            )}
          </ul>
        </div>

        {active && (
          <div
            className={cn("flex min-w-0 flex-1 flex-col", {
              "max-md:hidden": !showThread,
            })}
          >
            <div className="flex h-16 shrink-0 items-center gap-3 border-b border-[#e1e4ea] px-5">
              <button
                type="button"
                aria-label="Back to conversations"
                onClick={() => setShowThread(false)}
                className="-ml-2 grid size-9 place-content-center rounded-lg text-[#110f2e] md:hidden"
              >
                <ArrowLeft className="size-4" />
              </button>
              <Avatar
                conversation={{ ...active, online: false }}
                size="size-10"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-base leading-6 font-semibold text-[#110f2e]">
                  {active.name}
                </p>
                <p className="flex items-center gap-1.5 text-xs leading-4 text-[#6a7181]">
                  {active.online && (
                    <span className="size-1.5 rounded-full bg-[#29a36a]" />
                  )}
                  {active.online ? "Online" : "Offline"} · {active.project}
                </p>
              </div>
              <button
                type="button"
                aria-label={`Call ${active.name}`}
                className="grid size-10 place-content-center rounded-[11.6px] text-[#110f2e] hover:bg-[#f3f4f7]"
              >
                <Phone className="size-4" />
              </button>
              <button
                type="button"
                aria-label="More options"
                className="grid size-10 place-content-center rounded-[11.6px] text-[#110f2e] hover:bg-[#f3f4f7]"
              >
                <EllipsisVertical className="size-4" />
              </button>
            </div>

            <div
              ref={threadRef}
              className="flex-1 space-y-3 overflow-y-auto bg-[#f3f4f7]/30 p-5"
            >
              {active.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex", { "justify-end": message.fromMe })}
                >
                  <div
                    className={cn(
                      "max-w-[92%] space-y-1 rounded-2xl px-4 pt-2.25 pb-2.5 shadow-[0_1px_1px_rgba(37,33,94,0.04)]",
                      message.fromMe
                        ? "rounded-br-[9.6px] bg-[#25215e] text-white"
                        : "rounded-bl-[9.6px] bg-white text-[#110f2e]",
                    )}
                  >
                    <p className="text-sm leading-[22.75px]">{message.text}</p>
                    <p
                      className={cn("text-right text-[10px] leading-[15px]", {
                        "text-white/70": message.fromMe,
                        "text-[#6a7181]": !message.fromMe,
                      })}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={send}
              className="flex shrink-0 items-end gap-2 border-t border-[#e1e4ea] px-3 pt-3.25 pb-3"
            >
              <button
                type="button"
                aria-label="Attach a file"
                className="grid size-10 shrink-0 place-content-center rounded-[11.6px] text-[#6a7181] hover:bg-[#f3f4f7] max-sm:hidden"
              >
                <Paperclip className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Add emoji"
                className="grid size-10 shrink-0 place-content-center rounded-[11.6px] text-[#6a7181] hover:bg-[#f3f4f7] max-sm:hidden"
              >
                <Smile className="size-4" />
              </button>
              <label className="sr-only" htmlFor="inbox-message">
                Message
              </label>
              <textarea
                id="inbox-message"
                rows={1}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) send(event);
                }}
                placeholder="Type a message…"
                className="max-h-32 min-h-10 min-w-0 flex-1 resize-none rounded-xl bg-[#f3f4f7]/60 px-4 py-2.5 text-sm leading-5 text-[#110f2e] outline-none placeholder:text-[#9ca3af]"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                className="flex h-10 shrink-0 items-center gap-3 rounded-xl bg-[#be1e2d] px-4 text-sm font-medium text-white transition-colors hover:bg-[#be1e2d]/90 disabled:cursor-not-allowed"
              >
                <Send aria-hidden className="size-4" />
                <span className="max-sm:sr-only">Send</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </DashboardPage>
  );
}
