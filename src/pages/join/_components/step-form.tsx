import type { FormEvent, PropsWithChildren } from "react";

// Wraps every step so Enter submits and native validation stays out of the way
export default function StepForm({
  onSubmit,
  children,
}: PropsWithChildren<{ onSubmit: () => void }>) {
  return (
    <form
      noValidate
      onSubmit={(event: FormEvent) => {
        event.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      {children}
    </form>
  );
}
