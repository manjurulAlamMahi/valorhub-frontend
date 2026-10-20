import { ApiError, firstFieldErrors } from "@/lib/api";
import {
  invoiceApi,
  paymentMethods,
  type ContractorInvoice,
  type PaymentMethod,
} from "@/services/contractor";
import { Check } from "lucide-react";
import { useState } from "react";
import { formatMoney, toIsoDate } from "../data/invoices";
import Modal, { cancelButton, modalField, modalLabel } from "./modal";

type MarkPaidModalProps = {
  invoice: Pick<
    ContractorInvoice,
    "id" | "invoice_number" | "amount" | "customer"
  >;
  onClose: () => void;
  onPaid: (invoice: ContractorInvoice) => void;
};

// Records an offline payment (date can't be in the future)
export default function MarkPaidModal({
  invoice,
  onClose,
  onPaid,
}: MarkPaidModalProps) {
  const today = toIsoDate(new Date());
  const [date, setDate] = useState(today);
  const [method, setMethod] = useState<PaymentMethod>("bank_transfer");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!date) return;
    setSaving(true);
    setError("");
    try {
      const { data } = await invoiceApi.markPaid(invoice.id, {
        payment_date: date,
        payment_method: method,
      });
      onPaid(data);
    } catch (err) {
      const fields = err instanceof ApiError ? firstFieldErrors(err) : {};
      setError(
        fields.payment_date ??
          fields.payment_method ??
          (err instanceof ApiError ? err.message : "Could not record payment."),
      );
      setSaving(false);
    }
  };

  return (
    <Modal
      label="Mark as paid"
      onClose={onClose}
      onSubmit={() => void submit()}
      className="max-w-100"
    >
      <span className="grid size-11 place-content-center rounded-full bg-[#e5f5ed]">
        <Check aria-hidden className="size-5 text-[#268c59]" strokeWidth={3} />
      </span>
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-[#212633]">Mark as paid?</h2>
        <p className="text-[13px] text-[#8c949e]">
          {invoice.invoice_number} · {invoice.customer.name} ·{" "}
          {formatMoney(invoice.amount, true)}
        </p>
      </div>
      <div>
        <label htmlFor="payment-date" className={modalLabel}>
          Payment date
        </label>
        <input
          id="payment-date"
          type="date"
          required
          max={today}
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className={modalField}
        />
      </div>
      <div>
        <label htmlFor="payment-method" className={modalLabel}>
          Payment method
        </label>
        <select
          id="payment-method"
          value={method}
          onChange={(event) => setMethod(event.target.value as PaymentMethod)}
          className={modalField}
        >
          {paymentMethods.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p role="alert" className="text-xs text-[#c41e3a]">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2.5">
        <button type="button" onClick={onClose} className={cancelButton}>
          Cancel
        </button>
        <button
          type="submit"
          disabled={!date || saving}
          className="rounded-full bg-[#268c59] px-4.5 py-2.25 text-[13px] font-semibold text-white hover:bg-[#1f7449] disabled:opacity-50"
        >
          {saving ? "Saving…" : "Mark as Paid"}
        </button>
      </div>
    </Modal>
  );
}
