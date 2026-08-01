import api from "@/lib/api";

export const ReviewService = {
  async getAll() {
    const res = await api.get("/reviews");

    return res.data;
  },
};
