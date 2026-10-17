import { cn } from "@/lib/utils";
import { Link } from "react-router";
import Container from "./container";
import Section from "./section";

type CtaBannerProps = {
  badge?: string;
  title: string;
  description: string;
  actions?: {
    label: string;
    link: string;
    variant?: "primary" | "outline";
  }[];
  className?: string;
  containerClassName?: string;
  cardClassName?: string;
  titleClassName?: string;
};

export default function CtaBanner({
  badge,
  title,
  description,
  actions = [],
  className,
  containerClassName,
  cardClassName,
  titleClassName,
}: CtaBannerProps) {
  return (
    <Section className={cn("bg-muted", className)}>
      <Container className={containerClassName}>
        <div
          className={cn(
            "flex flex-col items-center gap-4 rounded-2xl bg-[url('/images/home/career/career.png')] bg-cover bg-center bg-no-repeat p-4 py-20 text-center",
            cardClassName,
          )}
        >
          {badge && (
            <img src={badge} alt="" className="size-12 object-contain" />
          )}

          <h2
            className={cn(
              "font-mono text-3xl leading-8 font-extrabold text-white lg:text-5xl lg:leading-12",
              titleClassName,
            )}
          >
            {title}
          </h2>

          <p className="text-sm text-white/70 sm:text-lg sm:leading-7">
            {description}
          </p>

          {actions.length > 0 && (
            <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
              {actions.map((action) => (
                <Link
                  key={action.label}
                  to={action.link}
                  className={cn(
                    "text-primary-foreground block rounded-[12px] px-8 py-4 text-center text-lg leading-7 font-bold max-sm:w-full",
                    action.variant === "outline" ? "border" : "bg-primary",
                  )}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
