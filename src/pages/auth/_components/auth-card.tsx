import { SEO } from "@/components/seo/SEO";
import StepCard from "@/pages/join/_components/step-card";
import type { PropsWithChildren, ReactNode } from "react";
import { Link } from "react-router";

type AuthCardProps = {
  title: string;
  description?: string;
  // Form-level error from the server (field errors render under their inputs)
  error?: string;
  footer?: ReactNode;
};

export default function AuthCard({
  title,
  description,
  error,
  footer,
  children,
}: PropsWithChildren<AuthCardProps>) {
  return (
    <main className="bg-input">
      <SEO
        title={title}
        description={description ?? title}
        robots="noindex, nofollow"
      />
      <div className="mx-auto max-w-120 space-y-6 px-4 py-10 sm:px-0 md:py-16">
        <StepCard title={title} description={description}>
          {error && (
            <p
              role="alert"
              className="mb-4 rounded-xl bg-[#c92032]/8 px-4 py-3 text-sm leading-5 text-[#c92032]"
            >
              {error}
            </p>
          )}
          {children}
        </StepCard>
        {footer && (
          <div className="space-y-2 text-center text-sm leading-5 text-[#6b6e8a]">
            {footer}
          </div>
        )}
      </div>
    </main>
  );
}

export function AuthLink({ to, children }: PropsWithChildren<{ to: string }>) {
  return (
    <Link
      to={to}
      className="text-secondary-foreground font-semibold hover:underline"
    >
      {children}
    </Link>
  );
}
