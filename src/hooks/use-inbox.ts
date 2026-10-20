import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api";
import {
  customerApi,
  type ConversationDetail,
  type ConversationSummary,
  type Paged,
} from "@/services/customer";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useDebounceValue } from "usehooks-ts";

// No websockets yet, so the open thread and the list poll for new messages
const POLL_MS = 15_000;

function usePolling(refetch: () => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const timer = window.setInterval(refetch, POLL_MS);
    return () => window.clearInterval(timer);
  }, [refetch, enabled]);
}

// Conversation list + open thread for the customer Inbox and contractor Messages.
// The open conversation lives in ?c=<id> so it can be linked to.
export function useInbox() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeId = Number(searchParams.get("c")) || null;
  const [query, setQuery] = useState("");
  const [search] = useDebounceValue(query.trim(), 300);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  const list = useApi<Paged<ConversationSummary> & { total_unread: number }>(
    "/messages",
    { search, per_page: 50 },
  );
  // Opening a thread marks it read on the server
  const thread = useApi<ConversationDetail>(
    activeId ? `/messages/${activeId}` : null,
  );
  usePolling(list.refetch, true);
  usePolling(thread.refetch, Boolean(activeId));

  // Ignore a previous thread's data while the newly selected one loads
  const active = thread.data?.id === activeId ? thread.data : undefined;

  return {
    query,
    setQuery,
    search,
    list,
    thread,
    activeId,
    active,
    sending,
    sendError,
    open: (id: number) => {
      setSearchParams({ c: String(id) });
      setSendError("");
      // The list's unread badge clears once the thread has loaded
      window.setTimeout(list.refetch, 500);
    },
    close: () => setSearchParams({}),
    // Resolves true when sent, so the caller can clear its draft
    send: async (body: string) => {
      if (!activeId || !body.trim()) return false;
      setSending(true);
      setSendError("");
      try {
        await customerApi.sendMessage(activeId, body.trim());
        thread.refetch();
        list.refetch();
        return true;
      } catch (err) {
        setSendError(
          err instanceof ApiError ? err.message : "Message not sent.",
        );
        return false;
      } finally {
        setSending(false);
      }
    },
  };
}
