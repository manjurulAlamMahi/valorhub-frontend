// Shared shape for the Products and My Services card grids
export type Listing = {
  id: string;
  name: string;
  category: string;
  description: string;
  // Display price, e.g. "$129.99", "$68/board" or "Custom Quote"
  price: string;
  active: boolean;
};
