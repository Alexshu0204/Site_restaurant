export interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  priceGourmand: number | null;
  priceTresGourmand: number | null;
  imageUrl: string | null;
  isAvailable: boolean;
}

export interface Category {
  id: number;
  name: string;
  menuItems: MenuItem[];
}
