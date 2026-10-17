import ContractorCard from "@/pages/contractor-list/_components/contractor-card";
import { contractors } from "@/pages/contractor-list/data/contractors";
import DashboardPage from "../_components/dashboard-page";
import { savedContractorIds } from "../data/dashboard";

export default function SavedContractors() {
  const saved = savedContractorIds
    .map((id) => contractors.find((contractor) => contractor.id === id))
    .filter((contractor) => contractor !== undefined);

  return (
    <DashboardPage
      title="Saved Contractors"
      description="Contractors you have bookmarked for quick access."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {saved.map((contractor) => (
          <ContractorCard key={contractor.id} contractor={contractor} />
        ))}
      </div>
    </DashboardPage>
  );
}
