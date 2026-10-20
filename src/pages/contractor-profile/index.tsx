import Breadcrumb from "@/components/shared/breadcrumb";
import Container from "@/components/shared/container";
import PageLoader from "@/components/shared/page-loader";
import { ErrorState } from "@/components/shared/query-state";
import { SEO } from "@/components/seo/SEO";
import { useApi } from "@/hooks/use-api";
import { breadcrumbSchema, professionalSchema } from "@/lib/schemas";
import Career from "@/pages/home/_components/career";
import { NotFound } from "@/pages/NotFound";
import type { ContractorProfile as ContractorProfileData } from "@/services/public";
import { useParams } from "react-router";
import CompanyOverview from "./_components/company-overview";
import CustomerReviews from "./_components/customer-reviews";
import OurProducts from "./_components/our-products";
import ProfileCover from "./_components/profile-cover";
import ProfileHeader from "./_components/profile-header";
import ProfileVideos from "./_components/profile-videos";
import ProjectGallery from "./_components/project-gallery";
import QuickContact from "./_components/quick-contact";
import ServiceLocation from "./_components/service-location";
import ServicesOffered from "./_components/services-offered";
import { contractorProfile } from "./data/contractor-profile";

export default function ContractorProfile() {
  const { id } = useParams();
  const valid = /^\d+$/.test(id ?? "");
  const { data, error, isLoading, refetch } = useApi<ContractorProfileData>(
    valid ? `/contractors/${id}` : null,
  );

  if (!valid || error?.status === 404) return <NotFound />;
  if (error) {
    return (
      <main className="bg-[#f8fafc]">
        <Container>
          <ErrorState error={error} onRetry={refetch} className="my-20" />
        </Container>
      </main>
    );
  }
  // Don't show the previous contractor while the next one loads
  if (!data || isLoading) return <PageLoader />;

  const url = `/contractors/${data.id}`;
  const primaryCategory = data.services[0]?.category;
  const listHref = primaryCategory?.id
    ? `/category/${primaryCategory.id}`
    : "/contractors";

  return (
    <>
      <SEO
        title={data.business_name}
        description={`${data.business_name} in ${data.location.display}. Rated ${data.rating}/5 from ${data.review_count} reviews. Request a free quote from this verified business on ValorHub.`}
        canonical={`https://valorhub.com${url}`}
        jsonLd={[
          professionalSchema({
            name: data.business_name,
            jobTitle: primaryCategory?.name ?? "Contractor",
            description: data.overview.bio,
            url,
            telephone: data.quick_contact.phone,
            areaServed: data.location.display,
            ratingValue: data.rating,
            reviewCount: data.review_count,
          }),
          breadcrumbSchema([
            { name: "Category", url: "/category" },
            { name: "Contractor List", url: listHref },
            { name: data.business_name, url },
          ]),
        ]}
      />

      <main className="relative bg-[#f8fafc]">
        <ProfileCover src={data.cover_photo} />

        <Container className="relative space-y-6 pt-6! pb-15!">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Category", href: "/category" },
              { label: "Contractor List", href: listHref },
              { label: contractorProfile.title, href: url },
            ]}
          />

          <div className="pt-32">
            <ProfileHeader contractor={data} />
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="min-w-0 flex-1 space-y-6">
              <CompanyOverview overview={data.overview} />
              <ProjectGallery images={data.gallery_images} />
              <ProfileVideos videos={data.videos} />
              <ServicesOffered services={data.services} />
              <OurProducts
                products={data.products}
                location={data.location.display}
              />
              <ServiceLocation
                location={data.location.display}
                areas={data.service_areas}
              />
              <CustomerReviews reviews={data.reviews} />
            </div>

            <div className="lg:w-91 lg:shrink-0 lg:self-stretch">
              <QuickContact
                contractorId={data.id}
                contact={data.quick_contact}
              />
            </div>
          </div>
        </Container>
      </main>

      <Career />
    </>
  );
}
