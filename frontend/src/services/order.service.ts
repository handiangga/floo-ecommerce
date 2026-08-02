import api from "@/lib/api";
export const OrderService = { checkout: (payload: { address_id: number; payment_method: string; shipping_cost?: number; shipping_method?: string; courier_service?: string; notes?: string }) => api.post("/orders/checkout", payload).then((response) => response.data) };
