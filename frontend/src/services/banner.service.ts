import api from "@/lib/api";

export const BannerService = {
  async getAll() {
    const res = await api.get("/banners");

    return res.data;
  },
};
