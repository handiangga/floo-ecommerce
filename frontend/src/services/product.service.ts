import api from "@/lib/api";

export const ProductService = {
  async getAll(params?: any) {
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
