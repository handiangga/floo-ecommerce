import { ProductVariant } from "./product";

export interface CartItem {
  id: number;

  qty: number;

  selected: boolean;

  product_variant: ProductVariant;
}

export interface Cart {
  id: number;

  customer_id: number;

  items: CartItem[];
}
