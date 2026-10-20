import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

const controlClass =
  "w-full rounded-[22px] border border-[#e5e7eb] bg-white px-4.25 text-sm text-[#1a1830] outline-none placeholder:text-[#99a1af] focus:border-[#26225f]/40 focus:ring-3 focus:ring-[#26225f]/10 aria-invalid:border-[#c92032]";

export function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${id}-error`} className="text-xs leading-4 text-[#c92032]">
      {error}
    </p>
  );
}

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  className?: string;
};

export function TextField({
  id,
  label,
  error,
  className,
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={id}
        className="block font-mono text-sm leading-5 font-semibold text-[#1a1830]"
      >
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(controlClass, "h-11.5")}
        {...props}
      />
      <FieldError id={id} error={error} />
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  error,
  className,
  ...props
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={id}
        className="block font-mono text-sm leading-5 font-semibold text-[#1a1830]"
      >
        {label}
      </label>
      <textarea
        id={id}
        rows={3}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(controlClass, "h-24 resize-y py-3.25 leading-5")}
        {...props}
      />
      <FieldError id={id} error={error} />
    </div>
  );
}

type OptionGroupProps = {
  id: string;
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  size?: "md" | "sm";
  className?: string;
};

// Pill radio group used for business type and category
export function OptionGroup({
  id,
  label,
  options,
  value,
  onChange,
  error,
  size = "md",
  className,
}: OptionGroupProps) {
  return (
    <fieldset
      className="space-y-1.5"
      aria-describedby={error ? `${id}-error` : undefined}
    >
      <legend className="pb-1.5 font-mono text-sm leading-5 font-semibold text-[#1a1830]">
        {label}
      </legend>
      <div className={cn("grid gap-2", className)}>
        {options.map((option) => (
          <label key={option} className="cursor-pointer">
            <input
              type="radio"
              name={id}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="peer sr-only"
            />
            <span
              className={cn(
                "flex items-center justify-center rounded-[22px] border-2 border-[#e5e7eb] text-center font-semibold text-[#4a5565] transition-colors peer-checked:border-[#26225f] peer-checked:bg-[#26225f]/5 peer-checked:text-[#26225f] peer-focus-visible:ring-3 peer-focus-visible:ring-[#26225f]/20 hover:border-[#26225f]/40",
                size === "md"
                  ? "h-11 px-4.5 text-sm leading-5"
                  : "h-9 px-3.5 text-xs leading-4",
              )}
            >
              {option}
            </span>
          </label>
        ))}
      </div>
      <FieldError id={id} error={error} />
    </fieldset>
  );
}

type ToggleCardProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function ToggleCard({ label, checked, onChange }: ToggleCardProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-[22px] border-2 border-[#e5e7eb] px-4.5 py-3.5 text-left text-sm leading-5 font-semibold text-[#1a1830] focus-visible:ring-3 focus-visible:ring-[#26225f]/20 focus-visible:outline-none"
    >
      {label}
      <span
        aria-hidden
        className={cn(
          "relative h-5 w-10 shrink-0 rounded-full bg-[#e5e7eb] transition-colors",
          { "bg-secondary-foreground": checked },
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.1)] transition-transform",
            { "translate-x-4.5": checked },
          )}
        />
      </span>
    </button>
  );
}

type UploadBoxProps = {
  id: string;
  icon: ReactNode;
  title: string;
  hint: string;
  accept: string;
  multiple?: boolean;
  // Max size per file in MB
  maxSize: number;
  files: File[];
  onChange: (files: File[]) => void;
  error?: string;
  onError: (error: string) => void;
  className?: string;
  children?: ReactNode;
};

// Dashed drop zone; keeps the picked files so the step can upload them
export function UploadBox({
  id,
  icon,
  title,
  hint,
  accept,
  multiple,
  maxSize,
  files,
  onChange,
  error,
  onError,
  className,
  children,
}: UploadBoxProps) {
  const handleFiles = (list: FileList | null) => {
    if (!list?.length) return;
    const picked = Array.from(list);
    const tooLarge = picked.find((file) => file.size > maxSize * 1024 * 1024);
    if (tooLarge) {
      onError(`${tooLarge.name} is larger than ${maxSize}MB.`);
      return;
    }
    onError("");
    // Re-picking a file with the same name replaces it instead of duplicating
    const kept = files.filter(
      (file) => !picked.some((item) => item.name === file.name),
    );
    onChange(multiple ? [...kept, ...picked] : picked.slice(0, 1));
  };

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          handleFiles(event.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#26225f]/20 px-4 py-6.5 text-center transition-colors focus-within:border-[#26225f]/50 hover:border-[#26225f]/40",
          { "border-[#c92032]": error },
          className,
        )}
      >
        {icon}
        <span className="text-secondary-foreground text-sm leading-5 font-semibold">
          {title}
        </span>
        <span className="text-xs leading-4 text-[#6b6e8a]">{hint}</span>
        {children}
        <input
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(event) => {
            handleFiles(event.target.files);
            event.target.value = "";
          }}
          className="sr-only"
        />
      </label>
      {files.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {files.map(({ name }) => (
            <li
              key={name}
              className="bg-secondary text-secondary-foreground flex max-w-full items-center gap-1.5 rounded-full py-1 pr-1.5 pl-3 text-xs leading-4 font-medium"
            >
              <span className="truncate">{name}</span>
              <button
                type="button"
                aria-label={`Remove ${name}`}
                onClick={() =>
                  onChange(files.filter((file) => file.name !== name))
                }
                className="grid size-4 shrink-0 place-content-center rounded-full hover:bg-[#26225f]/10"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <FieldError id={id} error={error} />
    </div>
  );
}

type ContinueButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  arrow?: boolean;
};

export function ContinueButton({
  arrow = true,
  disabled,
  className,
  children = "Continue",
  ...props
}: ContinueButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={cn(
        "flex h-12 w-full items-center justify-center gap-4 rounded-xl bg-[#be1e2d] px-6 text-[15.4px] font-bold text-white transition-colors hover:bg-[#a51a27] focus-visible:ring-3 focus-visible:ring-[#be1e2d]/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#be1e2d]",
        className,
      )}
      {...props}
    >
      {children}
      {arrow && <ArrowRight aria-hidden className="size-4" />}
    </button>
  );
}
