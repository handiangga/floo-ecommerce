import api from "@/lib/api";

export const CartService = {
  get: () => api.get("/cart").then((response) => response.data),
  add: (product_variant_id: number, qty: number) => api.post("/cart/items", { product_variant_id, qty }).then((response) => response.data),
  update: (id: number, qty: number) => api.put(`/cart/items/${id}`, { qty }).then((response) => response.data),
  remove: (id: number) => api.delete(`/cart/items/${id}`).then((response) => response.data),
};
