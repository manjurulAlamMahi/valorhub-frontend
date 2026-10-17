import { SEO } from "@/components/seo/SEO";
import ListingManager from "../_components/listing-manager";
import { serviceCategories, services } from "../data/services";

export default function MyServices() {
  return (
    <>
      <SEO
        title="My Services"
        description="Manage the services you offer on ValorHub."
        robots="noindex, nofollow"
      />
      <ListingManager
        noun="Service"
        categories={serviceCategories}
        initialItems={services}
        freeTextPrice
        banner={(count) => (
          <>
            <strong>Elite Plan:</strong> Unlimited services. Currently using{" "}
            <strong>{count}</strong>.
          </>
        )}
      />
    </>
  );
}
