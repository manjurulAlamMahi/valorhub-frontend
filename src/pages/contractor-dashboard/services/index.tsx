import { SEO } from "@/components/seo/SEO";
import ListingManager from "../_components/listing-manager";

export default function MyServices() {
  return (
    <>
      <SEO
        title="My Services"
        description="Manage the services you offer on ValorHub."
        robots="noindex, nofollow"
      />
      <ListingManager kind="service" />
    </>
  );
}
