import { createContext, useContext, type Dispatch } from "react";
import {
  conversations,
  invoices,
  notifications,
  quotes,
  requests,
  reviews,
  user,
  type Conversation,
  type Invoice,
  type QuoteStatus,
  type Review,
  type ServiceRequest,
} from "./dashboard";

export type Settings = {
  name: string;
  email: string;
  phone: string;
  emailNotifications: boolean;
};

export type DashboardState = {
  requests: ServiceRequest[];
  quoteStatus: Record<string, QuoteStatus>;
  invoices: Invoice[];
  reviews: Review[];
  conversations: Conversation[];
  notifications: typeof notifications;
  settings: Settings;
};

export type DashboardAction =
  | { type: "acceptQuote"; id: string }
  | { type: "declineQuote"; id: string }
  | { type: "payInvoice"; id: string }
  | { type: "saveReview"; id: string; rating: number; text: string }
  | { type: "sendMessage"; conversationId: string; text: string }
  | { type: "readConversation"; conversationId: string }
  | { type: "clearNotifications" }
  | { type: "saveSettings"; settings: Settings };

const today = () =>
  new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

const now = () =>
  new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

export const initialDashboardState: DashboardState = {
  requests,
  quoteStatus: Object.fromEntries(quotes.map((quote) => [quote.id, "pending"])),
  invoices,
  reviews,
  conversations,
  notifications,
  settings: {
    name: user.name,
    email: user.email,
    phone: user.phone,
    emailNotifications: user.emailNotifications,
  },
};

export function dashboardReducer(
  state: DashboardState,
  action: DashboardAction,
): DashboardState {
  switch (action.type) {
    case "acceptQuote": {
      const accepted = quotes.find((quote) => quote.id === action.id);
      if (!accepted) return state;
      // Accepting one quote declines the other quotes for the same request
      const quoteStatus = { ...state.quoteStatus };
      for (const quote of quotes) {
        if (quote.requestId === accepted.requestId)
          quoteStatus[quote.id] =
            quote.id === action.id ? "accepted" : "declined";
      }
      return {
        ...state,
        quoteStatus,
        requests: state.requests.map((request) =>
          request.id === accepted.requestId
            ? {
                ...request,
                status: "in_progress",
                contractor: accepted.contractor,
              }
            : request,
        ),
      };
    }
    case "declineQuote":
      return {
        ...state,
        quoteStatus: { ...state.quoteStatus, [action.id]: "declined" },
      };
    case "payInvoice":
      return {
        ...state,
        invoices: state.invoices.map((invoice) =>
          invoice.id === action.id
            ? { ...invoice, status: "paid", paidAt: today() }
            : invoice,
        ),
      };
    case "saveReview":
      return {
        ...state,
        reviews: state.reviews.map((review) =>
          review.id === action.id
            ? {
                ...review,
                rating: action.rating,
                text: action.text,
                reviewedAt: review.reviewedAt ?? today(),
              }
            : review,
        ),
      };
    case "sendMessage":
      return {
        ...state,
        conversations: state.conversations.map((conversation) =>
          conversation.id === action.conversationId
            ? {
                ...conversation,
                time: now(),
                messages: [
                  ...conversation.messages,
                  {
                    id: `m-${conversation.messages.length + 1}`,
                    fromMe: true,
                    text: action.text,
                    time: now(),
                  },
                ],
              }
            : conversation,
        ),
      };
    case "readConversation":
      return {
        ...state,
        conversations: state.conversations.map((conversation) =>
          conversation.id === action.conversationId
            ? { ...conversation, unread: 0 }
            : conversation,
        ),
      };
    case "clearNotifications":
      return { ...state, notifications: [] };
    case "saveSettings":
      return { ...state, settings: action.settings };
  }
}

export const DashboardContext = createContext<{
  state: DashboardState;
  dispatch: Dispatch<DashboardAction>;
} | null>(null);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context)
    throw new Error("useDashboard must be used inside DashboardLayout");
  return context;
}
