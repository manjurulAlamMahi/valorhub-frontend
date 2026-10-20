import { SEO } from "@/components/seo/SEO";
import PageLoader from "@/components/shared/page-loader";
import { ErrorState } from "@/components/shared/query-state";
import { useInbox } from "@/hooks/use-inbox";
import { cn } from "@/lib/utils";
import { ChevronLeft, Search, SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function Avatar({ name, small }: { name: string; small?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-content-center rounded-full bg-[#1b3a6b] text-xs leading-4 font-bold text-white",
        small ? "size-7" : "size-9",
      )}
    >
      {initials(name)}
    </span>
  );
}

export default function Messages() {
  const inbox = useInbox();
  const { list, thread, active, activeId, query, setQuery, search } = inbox;
  const [draft, setDraft] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);
  const conversations = list.data?.items ?? [];

  // Keep the newest message in view
  useEffect(() => {
    const element = threadRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [activeId, active?.messages.length]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (await inbox.send(draft)) setDraft("");
  };

  const subject = (conversation: {
    linked_subject: { title: string } | null;
  }) => conversation.linked_subject?.title;

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
            { "max-md:hidden": activeId },
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

          {!list.data && list.error ? (
            <ErrorState
              error={list.error}
              onRetry={list.refetch}
              className="m-4"
            />
          ) : !list.data ? (
            <PageLoader className="min-h-0 flex-1" />
          ) : (
            <ul className="flex-1 overflow-y-auto">
              {conversations.map((item) => {
                const selected = item.id === activeId;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => inbox.open(item.id)}
                      aria-current={selected ? "true" : undefined}
                      className={cn(
                        "flex w-full items-start gap-3 border-b border-[#0f172a]/6 px-4 py-3.5 text-left transition-colors hover:bg-[#f8fafc]",
                        { "bg-[#f0f7ff] hover:bg-[#f0f7ff]": selected },
                      )}
                    >
                      <span className="relative">
                        <Avatar name={item.other_user.name} />
                        {item.unread_count > 0 && (
                          <span className="absolute -top-1 left-6 grid size-4 place-content-center rounded-full bg-[#c41e3a] text-[10px] leading-[15px] font-bold text-white">
                            {item.unread_count}
                            <span className="sr-only"> unread</span>
                          </span>
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-1">
                          <span className="truncate text-sm leading-5 font-semibold text-[#0f172a]">
                            {item.other_user.name}
                          </span>
                          <span className="shrink-0 text-xs leading-4 text-[#94a3b8]">
                            {item.last_message?.sent_human}
                          </span>
                        </span>
                        {subject(item) && (
                          <span className="block text-xs leading-4 text-[#64748b]">
                            {subject(item)}
                          </span>
                        )}
                        <span
                          className={cn(
                            "block truncate pt-0.5 text-xs leading-4",
                            item.unread_count > 0
                              ? "font-medium text-[#374151]"
                              : "text-[#94a3b8]",
                          )}
                        >
                          {item.last_message
                            ? `${item.last_message.is_sender_me ? "You: " : ""}${item.last_message.body}`
                            : "No messages yet"}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
              {conversations.length === 0 && (
                <li className="p-6 text-center text-sm text-[#64748b]">
                  {search
                    ? "No conversations found."
                    : "No messages yet. Use “Message customer” on a quote request to start one."}
                </li>
              )}
            </ul>
          )}
        </section>

        <section
          aria-label={
            active
              ? `Conversation with ${active.other_user.name}`
              : "Conversation"
          }
          className={cn("flex min-w-0 flex-1 flex-col", {
            "max-md:hidden": !activeId,
          })}
        >
          {!activeId ? (
            <p className="m-auto p-6 text-center text-sm text-[#64748b]">
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
              <div className="flex items-center gap-3 border-b border-[#e2e8f0] bg-white px-4 py-3.5 sm:px-5">
                <button
                  type="button"
                  onClick={inbox.close}
                  aria-label="Back to conversations"
                  className="-ml-1 rounded-lg p-1 text-[#64748b] hover:bg-[#f1f5f9] md:hidden"
                >
                  <ChevronLeft aria-hidden className="size-5" />
                </button>
                <Avatar name={active.other_user.name} />
                <div className="min-w-0">
                  <p className="truncate text-sm leading-5 font-semibold text-[#0f172a]">
                    {active.other_user.name}
                  </p>
                  <p className="truncate text-xs leading-4 text-[#64748b]">
                    {active.linked_project?.title ??
                      active.linked_quote?.project_title ??
                      active.other_user.phone ??
                      ""}
                  </p>
                </div>
              </div>

              <div
                ref={threadRef}
                role="log"
                aria-live="polite"
                className="flex-1 space-y-4 overflow-y-auto bg-[#f8fafc] p-4 sm:p-5"
              >
                {active.messages.length === 0 && (
                  <p className="text-center text-sm text-[#64748b]">
                    Say hello to start the conversation.
                  </p>
                )}
                {active.messages.map((message) =>
                  message.is_sender_me ? (
                    <div
                      key={message.id}
                      className="ml-auto w-fit max-w-[min(28rem,85%)]"
                    >
                      <p className="rounded-2xl rounded-br-sm bg-[#262262] px-4 py-2.5 text-sm leading-5 whitespace-pre-line text-white">
                        {message.body}
                      </p>
                      <p
                        title={message.sent_date}
                        className="pt-1 text-right text-xs leading-4 text-[#94a3b8]"
                      >
                        {message.sent_time}
                      </p>
                    </div>
                  ) : (
                    <div key={message.id} className="flex items-end gap-2">
                      <span className="pb-5">
                        <Avatar name={active.other_user.name} small />
                      </span>
                      <div className="w-fit max-w-[min(28rem,80%)]">
                        <p className="rounded-2xl rounded-bl-sm bg-white px-4 py-2.5 text-sm leading-5 whitespace-pre-line text-[#0f172a] shadow-[0_1px_1.5px_rgba(0,0,0,0.06)]">
                          {message.body}
                        </p>
                        <p
                          title={message.sent_date}
                          className="pt-1 text-xs leading-4 text-[#94a3b8]"
                        >
                          {message.sent_time}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>

              {inbox.sendError && (
                <p
                  role="alert"
                  className="bg-white px-5 pt-2 text-sm text-[#c41e3a]"
                >
                  {inbox.sendError}
                </p>
              )}
              <form
                onSubmit={(event) => void handleSubmit(event)}
                className="flex items-center gap-3 border-t border-[#e2e8f0] bg-white px-4 py-4 sm:px-5"
              >
                <label htmlFor="message-input" className="sr-only">
                  Message {active.other_user.name}
                </label>
                <input
                  id="message-input"
                  value={draft}
                  maxLength={5000}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Type a message…"
                  autoComplete="off"
                  className="h-10.5 min-w-0 flex-1 rounded-xl border border-[#e2e8f0] px-4 text-sm text-[#0f172a] outline-none placeholder:text-[#0f172a]/50 focus:border-[#262262]/40 focus:ring-3 focus:ring-[#262262]/10"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={!draft.trim() || inbox.sending}
                  className="rounded-xl bg-[#262262] p-2.5 text-white transition-opacity hover:bg-[#211d53] disabled:opacity-60"
                >
                  <SendHorizontal aria-hidden className="size-4" />
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </>
  );
}
