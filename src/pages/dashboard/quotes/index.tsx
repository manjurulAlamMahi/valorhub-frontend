import { ActionButton, ActionLink } from "../_components/action-button";
import DashboardPage from "../_components/dashboard-page";
import StatusBadge from "../_components/status-badge";
import { formatMoneyShort, quotes, quoteTotal } from "../data/dashboard";
import { useDashboard } from "../data/dashboard-store";

export default function Quotes() {
  const { state, dispatch } = useDashboard();

  const groups = state.requests
    .map((request) => ({
      request,
      quotes: quotes.filter((quote) => quote.requestId === request.id),
    }))
    .filter((group) => group.quotes.length > 0);

  return (
    <DashboardPage
      card
      title="Quotes"
      description="Quotes received from contractors for your service requests."
    >
      {groups.map(({ request, quotes: items }) => (
        <section key={request.id} className="space-y-3">
          <h2 className="text-base leading-[normal] font-bold text-[#1e293b]">
            {request.title}
          </h2>
          <ul className="space-y-3">
            {items.map((quote) => {
              const status = state.quoteStatus[quote.id];
              return (
                <li
                  key={quote.id}
                  className="flex flex-wrap items-center gap-4 rounded-xl border border-[#e6eaf2] bg-white p-4.5 leading-[normal]"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-[15px] font-medium text-[#1e293b]">
                      {quote.contractor}
                    </p>
                    <p className="text-[13px] text-[#64748b]">
                      {quote.summary}
                    </p>
                  </div>
                  <p className="text-secondary-foreground text-lg font-bold">
                    {formatMoneyShort(quoteTotal(quote))}
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <ActionLink
                      variant="outline"
                      to={`/dashboard/quotes/${quote.id}`}
                    >
                      View details
                    </ActionLink>
                    {status === "pending" ? (
                      <ActionButton
                        onClick={() =>
                          dispatch({ type: "acceptQuote", id: quote.id })
                        }
                      >
                        Accept quote
                      </ActionButton>
                    ) : (
                      <StatusBadge status={status} />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </DashboardPage>
  );
}
