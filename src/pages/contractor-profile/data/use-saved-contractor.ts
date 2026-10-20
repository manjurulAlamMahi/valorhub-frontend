import { useAuth } from "@/hooks/use-auth";
import { customerApi } from "@/services/customer";
import { useEffect, useState } from "react";

// Saved (bookmarked) state of a contractor for the signed-in customer.
// The API has no "is saved" lookup, so the saved list is scanned page by page.
export function useSavedContractor(contractorId: number) {
  const { user } = useAuth();
  const isCustomer = user?.role === "customer";
  const [state, setState] = useState<{ id: number; saved: boolean } | null>(
    null,
  );

  useEffect(() => {
    if (!isCustomer) return;
    let cancelled = false;

    const lookup = async () => {
      for (let page = 1; ; page++) {
        const { data } = await customerApi.savedContractors(page);
        if (data.items.some((item) => item.contractor_id === contractorId))
          return true;
        if (page >= data.pagination.last_page) return false;
      }
    };

    lookup().then(
      (saved) => !cancelled && setState({ id: contractorId, saved }),
      () => !cancelled && setState({ id: contractorId, saved: false }),
    );
    return () => {
      cancelled = true;
    };
  }, [isCustomer, contractorId]);

  const known = state?.id === contractorId;

  return {
    // Guests see the heart and are sent to log in; contractors don't save contractors
    visible: !user || isCustomer,
    isCustomer,
    saved: known && state.saved,
    ready: !isCustomer || known,
    toggle: async () => {
      const { data } = await customerApi.toggleSaved(contractorId);
      setState({ id: contractorId, saved: data.is_saved });
    },
  };
}
