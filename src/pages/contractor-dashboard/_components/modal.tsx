import { cn } from "@/lib/utils";
import { useEffect, useRef, type FormEvent, type ReactNode } from "react";

type ModalProps = {
  label: string;
  onClose: () => void;
  onSubmit: () => void;
  className?: string;
  children: ReactNode;
};

// Centered dialog used by the invoice flow; renders as a form so Enter submits
export default function Modal({
  label,
  onClose,
  onSubmit,
  className,
  children,
}: ModalProps) {
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current
      ?.querySelector<HTMLElement>("input, textarea, select, button")
      ?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-60 grid place-items-center overflow-y-auto bg-[#0f172a]/50 p-4"
      onClick={onClose}
    >
      <form
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        noValidate
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event: FormEvent) => {
          event.preventDefault();
          onSubmit();
        }}
        className={cn(
          "w-full space-y-4.5 rounded-2xl bg-white p-6 leading-[normal] shadow-[0_8px_32px_rgba(0,0,0,0.18)]",
          className,
        )}
      >
        {children}
      </form>
    </div>
  );
}

export const modalField =
  "w-full rounded-[7px] border border-[#e5e8ed] bg-white px-3 py-2.25 text-[13px] font-medium text-[#212633] outline-none placeholder:font-normal placeholder:text-[#a6abb2] focus:border-[#262262]/40 focus:ring-3 focus:ring-[#262262]/10 aria-invalid:border-[#c41e3a]";
export const modalLabel = "block pb-1.5 text-xs font-semibold text-[#8c949e]";
export const cancelButton =
  "rounded-full border border-[#e5e8ed] bg-white px-4.5 py-2.25 text-[13px] font-medium text-[#212633] hover:bg-[#f8fafc]";
