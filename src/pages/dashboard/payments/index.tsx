import Pagination from "@/components/shared/pagination";
import { useApi } from "@/hooks/use-api";
import type { CustomerPayment, Paged } from "@/services/customer";
import { useState } from "react";
import DashboardPage from "../_components/dashboard-page";
import QueryBoundary from "@/components/shared/query-boundary";
import StatusBadge from "../_components/status-badge";

const columns = ["Date", "Invoice #", "Contractor", "Amount", "Status"];

export default function Payments() {
  const [page, setPage] = useState(1);
  const query = useApi<Paged<CustomerPayment>>("/customer/payments", { page });

  return (
    <DashboardPage
      title="Payments"
      description="Your payment history and receipts."
    >
      <QueryBoundary query={query}>
        {({ items, pagination }) =>
          items.length === 0 ? (
            <p className="rounded-xl border border-[#e6eaf2] bg-white p-10 text-center text-sm text-[#64748b]">
              No payments yet.
            </p>
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border border-[#e6eaf2] bg-white">
                <table className="w-full min-w-150 text-left text-[13px] leading-[normal]">
                  <thead className="bg-input text-[#64748b]">
                    <tr>
                      {columns.map((column) => (
                        <th
                          key={column}
                          scope="col"
                          className="px-5 py-3.5 font-medium"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-[#1e293b]">
                    {items.map((payment) => (
                      <tr
                        key={payment.id}
                        className="border-t border-[#e6eaf2]"
                      >
                        <td className="px-5 py-3.5">{payment.paid_at}</td>
                        <td className="px-5 py-3.5">
                          {payment.invoice_number}
                        </td>
                        <td className="px-5 py-3.5">
                          {payment.contractor.business_name}
                        </td>
                        <td className="px-5 py-3.5">
                          {payment.amount_display}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={payment.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                page={pagination.current_page}
                totalPages={pagination.last_page}
                onPageChange={setPage}
              />
            </>
          )
        }
      </QueryBoundary>
    </DashboardPage>
  );
}
