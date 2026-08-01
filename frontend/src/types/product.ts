export interface ProductImage {
  id: number;
  image_url: string;
  sort_order?: number;
}

export interface ProductVariant {
  id: number;
  sku: string;
  price: number;
  discount_price?: number;
  stock: number;
  weight: number;

  color?: {
    id: number;
    name: string;
    code: string;
  };

  size?: {
    id: number;
    name: string;
  };
}

export interface Product {
  id: number;

  category_id: number;

  name: string;
  slug: string;
  description: string;

  image_url?: string;
  image_path?: string;

  status: string;

  is_featured: boolean;
  is_best_seller?: boolean;
  is_new_arrival?: boolean;

  images?: ProductImage[];

  variants?: ProductVariant[];

  category?: {
    id: number;
    name: string;
    slug: string;
  };

  createdAt: string;
  updatedAt: string;
}
