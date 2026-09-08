import api from "@/lib/api";
import { ProductQuery } from "@/types/product";

export const ProductService = {
  async getAll(params?: ProductQuery) {
    const res = await api.get("/products", {
      params,
    });

    return res.data;
  },

  async getById(id: number) {
    const res = await api.get(`/products/${id}`);

    return res.data;
  },

  async getBySlug(slug: string) {
    const res = await api.get(`/products/slug/${slug}`);

    return res.data;
  },
};
