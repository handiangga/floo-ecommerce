import api from "@/lib/api";

export const HomepageCraftsmanshipService = {
  get: () => api.get("/homepage-craftsmanship").then((response) => response.data),
};
