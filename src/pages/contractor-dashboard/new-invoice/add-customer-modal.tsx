import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useState } from "react";
import Modal, { cancelButton, modalField } from "../_components/modal";
import { customers, type Customer } from "../data/customers";

type AddCustomerModalProps = {
  onClose: () => void;
  onSelect: (customer: Customer) => void;
};

function Initials({ name }: { name: string }) {
  return (
    <span
      aria-hidden
      className="grid size-7.5 shrink-0 place-content-center rounded-full bg-[#1b3a6b] text-[11px] font-bold text-white"
    >
      {name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}

export default function AddCustomerModal({
  onClose,
  onSelect,
}: AddCustomerModalProps) {
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const search = query.trim().toLowerCase();
  const results = search
    ? customers.filter((item) =>
        `${item.name} ${item.email}`.toLowerCase().includes(search),
      )
    : customers.slice(0, 3);

  const submit = () => {
    const next: typeof errors = {};
    if (!draft.name.trim()) next.name = "Enter a customer or business name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim()))
      next.email = "Enter a valid email address.";
    setErrors(next);
    if (Object.keys(next).length) return;
    onSelect({
      name: draft.name.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim() || undefined,
      address: draft.address.trim() || undefined,
    });
  };

  const update = (key: keyof typeof draft, value: string) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <Modal
      label="Add a customer"
      onClose={onClose}
      onSubmit={submit}
      className="max-w-110"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[17px] font-bold text-[#212633]">Add a customer</h2>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="rounded p-1 text-[#8c949e] hover:bg-[#f1f5f9]"
        >
          <X aria-hidden className="size-4" />
        </button>
      </div>

      <div className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#8c949e]"
        />
        <label htmlFor="customer-search" className="sr-only">
          Search existing customers
        </label>
        <input
          id="customer-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search existing customers…"
          className={cn(modalField, "rounded-lg py-2.5 pl-8 font-normal")}
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-[#8c949e]">
          {search ? "Matching customers" : "Recent customers"}
        </p>
        {results.length > 0 ? (
          <ul className="divide-y divide-[#e5e8ed] overflow-hidden rounded-lg border border-[#e5e8ed]">
            {results.map((item) => (
              <li key={item.name}>
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left hover:bg-[#f8fafc] focus-visible:bg-[#f8fafc] focus-visible:outline-none"
                >
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt=""
                      className="size-7.5 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <Initials name={item.name} />
                  )}
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold text-[#212633]">
                      {item.name}
                    </span>
                    <span className="block truncate text-[11.5px] text-[#8c949e]">
                      {item.email}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-lg border border-[#e5e8ed] px-3 py-4 text-center text-[13px] text-[#8c949e]">
            No customers match “{query}”.
          </p>
        )}
      </div>

      <div className="flex items-center gap-2.5 text-xs text-[#8c949e]">
        <span className="h-px flex-1 bg-[#e5e8ed]" />
        or
        <span className="h-px flex-1 bg-[#e5e8ed]" />
      </div>

      <fieldset className="min-w-0 space-y-2.5">
        <legend className="pb-2 text-[13px] font-semibold text-[#212633]">
          Add a new customer
        </legend>
        <div>
          <input
            aria-label="Customer or business name"
            placeholder="Customer or business name"
            value={draft.name}
            aria-invalid={Boolean(errors.name)}
            onChange={(event) => update("name", event.target.value)}
            className={modalField}
          />
          {errors.name && (
            <p className="pt-1 text-xs text-[#c41e3a]">{errors.name}</p>
          )}
        </div>
        <div>
          <input
            type="email"
            aria-label="Email address"
            placeholder="Email address"
            value={draft.email}
            aria-invalid={Boolean(errors.email)}
            onChange={(event) => update("email", event.target.value)}
            className={modalField}
          />
          {errors.email && (
            <p className="pt-1 text-xs text-[#c41e3a]">{errors.email}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <input
            type="tel"
            aria-label="Phone number"
            placeholder="Phone number"
            value={draft.phone}
            onChange={(event) => update("phone", event.target.value)}
            className={modalField}
          />
          <input
            aria-label="Billing address"
            placeholder="Billing address"
            value={draft.address}
            onChange={(event) => update("address", event.target.value)}
            className={modalField}
          />
        </div>
      </fieldset>

      <div className="flex justify-end gap-2.5">
        <button type="button" onClick={onClose} className={cancelButton}>
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-full bg-[#c41e3a] px-4.5 py-2.25 text-[13px] font-semibold text-white hover:bg-[#a51a31]"
        >
          Add Customer
        </button>
      </div>
    </Modal>
  );
}
