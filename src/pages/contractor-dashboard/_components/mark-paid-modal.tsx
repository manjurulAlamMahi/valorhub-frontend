import { Check } from "lucide-react";
import { useState } from "react";
import { formatMoney, type Invoice } from "../data/invoices";
import Modal, { cancelButton, modalField, modalLabel } from "./modal";

const methods = ["Bank transfer", "Credit card", "Check", "Cash", "Other"];

type MarkPaidModalProps = {
  invoice: Invoice;
  onClose: () => void;
  onConfirm: (payment: { date: string; method: string }) => void;
};

const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export default function MarkPaidModal({
  invoice,
  onClose,
  onConfirm,
}: MarkPaidModalProps) {
  const [date, setDate] = useState(today);
  const [method, setMethod] = useState(methods[0]);

  return (
    <Modal
      label="Mark as paid"
      onClose={onClose}
      onSubmit={() => date && onConfirm({ date, method })}
      className="max-w-100"
    >
      <span className="grid size-11 place-content-center rounded-full bg-[#e5f5ed]">
        <Check aria-hidden className="size-5 text-[#268c59]" strokeWidth={3} />
      </span>
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-[#212633]">Mark as paid?</h2>
        <p className="text-[13px] text-[#8c949e]">
          {invoice.id} · {invoice.customer} ·{" "}
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
          onChange={(event) => setMethod(event.target.value)}
          className={modalField}
        >
          {methods.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-end gap-2.5">
        <button type="button" onClick={onClose} className={cancelButton}>
          Cancel
        </button>
        <button
          type="submit"
          disabled={!date}
          className="rounded-full bg-[#268c59] px-4.5 py-2.25 text-[13px] font-semibold text-white hover:bg-[#1f7449] disabled:opacity-50"
        >
          Mark as Paid
        </button>
      </div>
    </Modal>
  );
}
