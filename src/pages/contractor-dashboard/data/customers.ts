import { customerDetails } from "./invoices";

const IMAGES = "/images/contractor-dashboard/customers";

export type Customer = {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
};

const avatars: Record<string, string> = {
  "Robert Henderson": `${IMAGES}/robert.png`,
  "Tanya Williams": `${IMAGES}/tanya.png`,
  "Patricia Nguyen": `${IMAGES}/patricia.png`,
};

// Most recent first; the first three appear as "Recent customers"
export const customers: Customer[] = Object.entries(customerDetails).map(
  ([name, details]) => ({ name, ...details, avatar: avatars[name] }),
);
