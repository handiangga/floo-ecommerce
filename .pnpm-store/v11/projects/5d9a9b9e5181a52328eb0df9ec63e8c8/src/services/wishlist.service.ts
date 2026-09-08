import api from "@/lib/api";

export const WishlistService = {
  get: () => api.get("/wishlist").then((response) => response.data),
  add: (product_id: number) => api.post("/wishlist", { product_id }).then((response) => response.data),
  remove: (productId: number) => api.delete(`/wishlist/${productId}`).then((response) => response.data),
};
