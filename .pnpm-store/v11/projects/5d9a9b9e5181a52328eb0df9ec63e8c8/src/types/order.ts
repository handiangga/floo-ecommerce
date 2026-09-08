export interface OrderItem {
  id: number;

  product_name: string;

  color_name: string;

  size_name: string;

  qty: number;

  subtotal: number;

  price: number;
}

export interface Order {
  id: number;

  invoice: string;

  status: string;

  subtotal: number;

  shipping_cost: number;

  discount: number;

  total: number;

  createdAt: string;

  items: OrderItem[];
}
