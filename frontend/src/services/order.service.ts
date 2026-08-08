import api from "@/lib/api";
export const OrderService = {
  checkout: (payload: {
    address_id: number;
    payment_method: string;
    voucher_code?: string;
    shipping_cost?: number;
    shipping_method?: string;
    courier_service?: string;
    notes?: string;
  }) => api.post("/orders/checkout", payload).then((response) => response.data),
  getMyOrders: () =>
    api.get("/orders/my/orders").then((response) => response.data),
  getMyOrder: (id: string) =>
    api.get(`/orders/my/orders/${id}`).then((response) => response.data),
};

export const PaymentService = {
  createForOrder: (orderId: number) =>
    api.post(`/payments/my/order/${orderId}`).then((response) => response.data),
  getForOrder: (orderId: string) =>
    api.get(`/payments/my/order/${orderId}`).then((response) => response.data),
  submitProof: (paymentId: number, data: FormData) =>
    api
      .post(`/payments/my/${paymentId}/proof`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => response.data),
};
