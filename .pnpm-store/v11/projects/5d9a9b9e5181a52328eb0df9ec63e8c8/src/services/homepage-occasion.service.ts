import api from "@/lib/api";

export const HomepageOccasionService = {
  getAll: () => api.get("/homepage-occasions").then((response) => response.data),
};
