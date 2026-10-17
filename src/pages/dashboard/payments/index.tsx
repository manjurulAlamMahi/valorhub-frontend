import DashboardPage from "../_components/dashboard-page";
import { formatMoney, invoiceTotal, paymentHistory } from "../data/dashboard";
import { useDashboard } from "../data/dashboard-store";

const columns = ["Date", "Invoice #", "Contractor", "Amount", "Status"];

export default function Payments() {
  const { state } = useDashboard();

  const payments = [
    ...state.invoices
      .filter((invoice) => invoice.status === "paid")
      .map((invoice) => ({
        invoiceId: invoice.id,
        contractor: invoice.contractor,
        amount: invoiceTotal(invoice),
        paidAt: invoice.paidAt ?? "",
      })),
    ...paymentHistory,
  ].sort((a, b) => Date.parse(b.paidAt) - Date.parse(a.paidAt));

  return (
    <DashboardPage
      title="Payments"
      description="Your payment history and receipts."
    >
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
            {payments.map((payment) => (
              <tr key={payment.invoiceId} className="border-t border-[#e6eaf2]">
                <td className="px-5 py-3.5">{payment.paidAt}</td>
                <td className="px-5 py-3.5">{payment.invoiceId}</td>
                <td className="px-5 py-3.5">{payment.contractor}</td>
                <td className="px-5 py-3.5">{formatMoney(payment.amount)}</td>
                <td className="px-5 py-3.5">Paid</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardPage>
  );
}
