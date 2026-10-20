import { SEO } from "@/components/seo/SEO";
import ListingManager from "../_components/listing-manager";

export default function ContractorProducts() {
  return (
    <>
      <SEO
        title="Products"
        description="Manage the products you sell on ValorHub."
        robots="noindex, nofollow"
      />
      <ListingManager kind="product" />
    </>
  );
}
