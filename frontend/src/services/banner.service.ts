import api from "@/lib/api";

export const BannerService = {
  async getAll() {
    const { data } = await api.get("/banners");

    return data;
  },
};
