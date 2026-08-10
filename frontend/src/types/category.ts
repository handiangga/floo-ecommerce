export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id?: number | null;
  subcategories?: Category[];

  image: string;

  description?: string;

  createdAt: string;
  updatedAt: string;
}
