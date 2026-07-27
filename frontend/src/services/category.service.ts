import api from "@/lib/api";

export const CategoryService = {
  async getAll() {
    const res = await api.get("/categories");

    return res.data;
  },
};
