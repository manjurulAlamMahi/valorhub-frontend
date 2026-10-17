import CtaBanner from "@/components/shared/cta-banner";
import { career } from "../data/carrer";

export default function Career() {
  return (
    <CtaBanner
      badge={career.badge}
      title={career.title}
      description={career.description}
      actions={[
        career.cta.professional,
        { ...career.cta.learnMore, variant: "outline" },
      ]}
    />
  );
}
