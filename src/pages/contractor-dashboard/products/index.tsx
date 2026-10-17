import { SEO } from "@/components/seo/SEO";
import ListingManager from "../_components/listing-manager";
import { productCategories, products } from "../data/products";

export default function ContractorProducts() {
  return (
    <>
      <SEO
        title="Products"
        description="Manage the products you sell on ValorHub."
        robots="noindex, nofollow"
      />
      <ListingManager
        noun="Product"
        categories={productCategories}
        initialItems={products}
        banner={(count) => (
          <strong>
            Elite Plan: Unlimited product listings. Currently using {count}.
          </strong>
        )}
      />
    </>
  );
}
