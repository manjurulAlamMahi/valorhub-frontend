import { Paperclip } from "lucide-react";
import { useState } from "react";
import { contractor } from "../data/contractor-dashboard";
import {
  customerDetails,
  formatDate,
  formatMoney,
  type Invoice,
} from "../data/invoices";
import Modal, { cancelButton, modalField, modalLabel } from "./modal";

type SendInvoiceModalProps = {
  invoice: Invoice;
  onClose: () => void;
  onSend: () => void;
};

export default function SendInvoiceModal({
  invoice,
  onClose,
  onSend,
}: SendInvoiceModalProps) {
  const firstName = invoice.customer.split(" ")[0];
  const [to, setTo] = useState(customerDetails[invoice.customer]?.email ?? "");
  const [subject, setSubject] = useState(
    `Invoice ${invoice.id} from ${contractor.business} — ${formatMoney(invoice.amount, true)} due ${formatDate(invoice.due)}`,
  );
  const [message, setMessage] = useState(
    `Hi ${firstName}, thanks for choosing ${contractor.business}. Please find your invoice for the ${invoice.project.toLowerCase()} attached — let me know if you have any questions.`,
  );
  const [error, setError] = useState("");

  const submit = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to.trim()))
      return setError("Enter a valid email address.");
    onSend();
  };

  return (
    <Modal
      label="Send invoice to customer"
      onClose={onClose}
      onSubmit={submit}
      className="max-w-110 space-y-4"
    >
      <h2 className="text-[17px] font-bold text-[#212633]">
        Send invoice to customer
      </h2>
      <div>
        <label htmlFor="send-to" className={modalLabel}>
          To
        </label>
        <input
          id="send-to"
          type="email"
          value={to}
          aria-invalid={Boolean(error)}
          onChange={(event) => {
            setTo(event.target.value);
            setError("");
          }}
          className={modalField}
        />
        {error && <p className="pt-1 text-xs text-[#c41e3a]">{error}</p>}
      </div>
      <div>
        <label htmlFor="send-subject" className={modalLabel}>
          Subject
        </label>
        <textarea
          id="send-subject"
          rows={2}
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          className={`${modalField} resize-none`}
        />
      </div>
      <div>
        <label htmlFor="send-message" className={modalLabel}>
          Message
        </label>
        <textarea
          id="send-message"
          rows={3}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className={`${modalField} min-h-19 resize-y text-[12.5px] font-normal`}
        />
      </div>
      <p className="flex items-center gap-1.5 text-xs text-[#8c949e]">
        <Paperclip aria-hidden className="size-3.5" />
        {invoice.id}.pdf attached
      </p>
      <div className="flex justify-end gap-2.5">
        <button type="button" onClick={onClose} className={cancelButton}>
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-full bg-[#c41e3a] px-4.5 py-2.25 text-[13px] font-semibold text-white hover:bg-[#a51a31]"
        >
          Send Invoice
        </button>
      </div>
    </Modal>
  );
}
