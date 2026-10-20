import PageLoader from "@/components/shared/page-loader";
import { ErrorState } from "@/components/shared/query-state";
import { useInbox } from "@/hooks/use-inbox";
import { cn } from "@/lib/utils";
import { ArrowLeft, Phone, Search, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DashboardPage from "../_components/dashboard-page";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function Avatar({ name, size = "size-11" }: { name: string; size?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-content-center rounded-full bg-[#25215e]/10 text-base leading-6 font-semibold text-[#25215e]",
        size,
      )}
    >
      {initials(name)}
    </span>
  );
}

export default function Inbox() {
  const inbox = useInbox();
  const { list, thread, active, query, setQuery, search, sending, sendError } =
    inbox;
  const selectedId = inbox.activeId;
  const conversations = list.data?.items ?? [];
  const [draft, setDraft] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [active?.messages.length, selectedId]);

  const open = inbox.open;

  // Called from the form submit and from Enter in the textarea
  const send = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (await inbox.send(draft)) setDraft("");
  };

  if (!list.data && list.error) {
    return (
      <DashboardPage
        title="Inbox"
        description="Messages with contractors about your projects."
      >
        <ErrorState error={list.error} onRetry={list.refetch} />
      </DashboardPage>
    );
  }

  return (
    <DashboardPage
      title="Inbox"
      description="Messages with contractors about your projects."
    >
      <div className="flex h-133.5 overflow-hidden rounded-2xl border border-[#e6eaf2] bg-white">
        <div
          className={cn(
            "flex w-full flex-col border-[#e1e4ea] md:w-80 md:shrink-0 md:border-r",
            { "max-md:hidden": selectedId },
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

          {!list.data ? (
            <PageLoader className="min-h-0 flex-1" />
          ) : (
            <ul className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <li key={conversation.id}>
                  <button
                    type="button"
                    onClick={() => open(conversation.id)}
                    aria-current={
                      conversation.id === selectedId ? "true" : undefined
                    }
                    className={cn(
                      "flex w-full items-start gap-3 border-b border-[#e1e4ea] px-4 pt-3 pb-3.25 text-left transition-colors hover:bg-[#efeffb]/40",
                      { "bg-[#efeffb]/60": conversation.id === selectedId },
                    )}
                  >
                    <Avatar name={conversation.other_user.name} />
                    <span className="min-w-0 flex-1 space-y-0.5">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm leading-5 font-semibold text-[#110f2e]">
                          {conversation.other_user.name}
                        </span>
                        <span className="shrink-0 text-[11px] leading-4 text-[#6a7181]">
                          {conversation.last_message?.sent_human}
                        </span>
                      </span>
                      {conversation.linked_subject && (
                        <span className="block text-xs leading-4 text-[#25215e]">
                          {conversation.linked_subject.title}
                        </span>
                      )}
                      <span className="line-clamp-2 text-sm leading-5 text-[#6a7181]">
                        {conversation.last_message
                          ? `${conversation.last_message.is_sender_me ? "You: " : ""}${conversation.last_message.body}`
                          : "No messages yet"}
                      </span>
                    </span>
                    {conversation.unread_count > 0 && (
                      <span className="mt-1 grid h-5 min-w-5 place-content-center rounded-full bg-[#25215e] px-1.5 text-[11px] font-bold text-white">
                        <span className="sr-only">Unread: </span>
                        {conversation.unread_count}
                      </span>
                    )}
                  </button>
                </li>
              ))}
              {conversations.length === 0 && (
                <li className="p-6 text-center text-sm text-[#6a7181]">
                  {search
                    ? "No conversations found."
                    : "No messages yet. Conversations with contractors appear here."}
                </li>
              )}
            </ul>
          )}
        </div>

        <div
          className={cn("flex min-w-0 flex-1 flex-col", {
            "max-md:hidden": !selectedId,
          })}
        >
          {!selectedId ? (
            <p className="m-auto p-6 text-center text-sm text-[#6a7181]">
              Select a conversation to read your messages.
            </p>
          ) : !active && thread.error ? (
            <ErrorState
              error={thread.error}
              onRetry={thread.refetch}
              className="m-6"
            />
          ) : !active ? (
            <PageLoader className="min-h-0 flex-1" />
          ) : (
            <>
              <div className="flex h-16 shrink-0 items-center gap-3 border-b border-[#e1e4ea] px-5">
                <button
                  type="button"
                  aria-label="Back to conversations"
                  onClick={inbox.close}
                  className="-ml-2 grid size-9 place-content-center rounded-lg text-[#110f2e] md:hidden"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <Avatar name={active.other_user.name} size="size-10" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base leading-6 font-semibold text-[#110f2e]">
                    {active.other_user.name}
                  </p>
                  <p className="truncate text-xs leading-4 text-[#6a7181]">
                    {active.linked_project?.title ??
                      active.linked_quote?.project_title ??
                      active.other_user.location.replace(/^,\s*|,\s*$/g, "")}
                  </p>
                </div>
                {active.other_user.phone && (
                  <a
                    href={`tel:${active.other_user.phone.replace(/[^\d+]/g, "")}`}
                    aria-label={`Call ${active.other_user.name}`}
                    className="grid size-10 place-content-center rounded-[11.6px] text-[#110f2e] hover:bg-[#f3f4f7]"
                  >
                    <Phone className="size-4" />
                  </a>
                )}
              </div>

              <div
                ref={threadRef}
                className="flex-1 space-y-3 overflow-y-auto bg-[#f3f4f7]/30 p-5"
              >
                {active.messages.length === 0 && (
                  <p className="text-center text-sm text-[#6a7181]">
                    Say hello to start the conversation.
                  </p>
                )}
                {active.messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex", {
                      "justify-end": message.is_sender_me,
                    })}
                  >
                    <div
                      className={cn(
                        "max-w-[92%] space-y-1 rounded-2xl px-4 pt-2.25 pb-2.5 shadow-[0_1px_1px_rgba(37,33,94,0.04)]",
                        message.is_sender_me
                          ? "rounded-br-[9.6px] bg-[#25215e] text-white"
                          : "rounded-bl-[9.6px] bg-white text-[#110f2e]",
                      )}
                    >
                      <p className="text-sm leading-[22.75px] whitespace-pre-line">
                        {message.body}
                      </p>
                      <p
                        title={message.sent_date}
                        className={cn("text-right text-[10px] leading-[15px]", {
                          "text-white/70": message.is_sender_me,
                          "text-[#6a7181]": !message.is_sender_me,
                        })}
                      >
                        {message.sent_time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {sendError && (
                <p role="alert" className="px-4 pt-2 text-sm text-[#c92032]">
                  {sendError}
                </p>
              )}
              <form
                onSubmit={(event) => void send(event)}
                className="flex shrink-0 items-end gap-2 border-t border-[#e1e4ea] px-3 pt-3.25 pb-3"
              >
                <label className="sr-only" htmlFor="inbox-message">
                  Message
                </label>
                <textarea
                  id="inbox-message"
                  rows={1}
                  maxLength={5000}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey)
                      void send(event);
                  }}
                  placeholder="Type a message…"
                  className="max-h-32 min-h-10 min-w-0 flex-1 resize-none rounded-xl bg-[#f3f4f7]/60 px-4 py-2.5 text-sm leading-5 text-[#110f2e] outline-none placeholder:text-[#9ca3af]"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || sending}
                  className="flex h-10 shrink-0 items-center gap-3 rounded-xl bg-[#be1e2d] px-4 text-sm font-medium text-white transition-colors hover:bg-[#be1e2d]/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Send aria-hidden className="size-4" />
                  <span className="max-sm:sr-only">
                    {sending ? "Sending…" : "Send"}
                  </span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </DashboardPage>
  );
}
