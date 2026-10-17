import Breadcrumb from "@/components/shared/breadcrumb";
import Container from "@/components/shared/container";
import { SEO } from "@/components/seo/SEO";
import { breadcrumbSchema, professionalSchema } from "@/lib/schemas";
import { contractors } from "@/pages/contractor-list/data/contractors";
import Career from "@/pages/home/_components/career";
import { NotFound } from "@/pages/NotFound";
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
  const contractor = contractors.find((item) => item.id === id);

  if (!contractor) return <NotFound />;

  const url = `/contractors/${contractor.id}`;

  return (
    <>
      <SEO
        title={contractor.name}
        description={`${contractor.name} — ${contractor.role.toLowerCase()} in ${contractor.location}. Rated ${contractorProfile.rating}/5 from ${contractorProfile.reviewCount} reviews. Request a free quote from this verified veteran-owned business on ValorHub.`}
        canonical={`https://valorhub.com${url}`}
        jsonLd={[
          professionalSchema({
            name: contractor.name,
            jobTitle: contractor.role,
            description: contractorProfile.overview.description,
            url,
            telephone: contractorProfile.contact.phone,
            areaServed: contractor.location,
            ratingValue: contractorProfile.rating,
            reviewCount: contractorProfile.reviewCount,
          }),
          breadcrumbSchema([
            { name: "Category", url: "/category" },
            {
              name: "Contractor List",
              url: `/category/${contractor.category}`,
            },
            { name: contractor.name, url },
          ]),
        ]}
      />

      <main className="relative bg-[#f8fafc]">
        <ProfileCover />

        <Container className="relative space-y-6 pt-6! pb-15!">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Category", href: "/category" },
              {
                label: "Contractor List",
                href: `/category/${contractor.category}`,
              },
              { label: contractorProfile.title, href: url },
            ]}
          />

          <div className="pt-32">
            <ProfileHeader contractor={contractor} />
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="min-w-0 flex-1 space-y-6">
              <CompanyOverview />
              <ProjectGallery />
              <ProfileVideos />
              <ServicesOffered />
              <OurProducts />
              <ServiceLocation />
              <CustomerReviews />
            </div>

            <div className="lg:w-91 lg:shrink-0 lg:self-stretch">
              <QuickContact contractorId={contractor.id} />
            </div>
          </div>
        </Container>
      </main>

      <Career />
    </>
  );
}
