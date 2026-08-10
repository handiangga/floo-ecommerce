import api from "@/lib/api";

export const AdminService = {
  storeSettings: () =>
    api.get("/store-settings").then((response) => response.data),
  updateStoreSettings: (payload: Record<string, string | boolean>) =>
    api.put("/store-settings", payload).then((response) => response.data),
  login: (email: string, password: string) =>
    api
      .post("/auth/login", { email, password })
      .then((response) => response.data),
  logout: () => api.post("/auth/logout").then((response) => response.data),
  dashboard: () => api.get("/dashboard").then((response) => response.data),
  dashboardRevenue: () =>
    api.get("/dashboard/revenue").then((response) => response.data),
  dashboardOrderStatistics: () =>
    api.get("/dashboard/orders").then((response) => response.data),
  dashboardTopProducts: () =>
    api
      .get("/dashboard/top-products", { params: { limit: 5 } })
      .then((response) => response.data),
  dashboardRecentOrders: () =>
    api
      .get("/dashboard/recent-orders", { params: { limit: 5 } })
      .then((response) => response.data),
  products: () =>
    api
      .get("/products", { params: { limit: 100 } })
      .then((response) => response.data),
  removeProduct: (id: number) =>
    api.delete(`/products/${id}`).then((response) => response.data),
  createProduct: (data: FormData) =>
    api
      .post("/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => response.data),
  product: (id: string) =>
    api.get(`/products/${id}`).then((response) => response.data),
  updateProduct: (id: string, data: FormData) =>
    api
      .put(`/products/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => response.data),
  variants: (productId: string) =>
    api
      .get(`/product-variants/product/${productId}`)
      .then((response) => response.data),
  colors: () => api.get("/colors").then((response) => response.data),
  sizes: () => api.get("/sizes").then((response) => response.data),
  createVariant: (payload: {
    product_id: number;
    color_id: number;
    size_id: number;
    price: number;
    stock: number;
    weight?: number;
    discount_price?: number;
  }) =>
    api.post("/product-variants", payload).then((response) => response.data),
  images: (productId: string) =>
    api.get(`/product-images/${productId}`).then((response) => response.data),
  uploadImages: (data: FormData) =>
    api
      .post("/product-images", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => response.data),
  removeImage: (id: number) =>
    api.delete(`/product-images/${id}`).then((response) => response.data),
  reorderImages: (productId: string, imageIds: number[]) =>
    api
      .put(`/product-images/product/${productId}/reorder`, {
        image_ids: imageIds,
      })
      .then((response) => response.data),
  updateVariant: (
    id: number,
    payload: {
      price?: number;
      discount_price?: number | null;
      stock?: number;
      status?: "ACTIVE" | "INACTIVE";
    },
  ) =>
    api
      .put(`/product-variants/${id}`, payload)
      .then((response) => response.data),
  removeVariant: (id: number) =>
    api.delete(`/product-variants/${id}`).then((response) => response.data),
  orders: () =>
    api
      .get("/orders", { params: { limit: 100 } })
      .then((response) => response.data),
  updateOrderStatus: (
    id: number,
    status: string,
    shipment: { tracking_number?: string; courier_service?: string } = {},
  ) =>
    api
      .patch(`/orders/${id}/status`, { status, ...shipment })
      .then((response) => response.data),
  approveManualPayment: (id: number) =>
    api
      .post(`/payments/${id}/approve-manual`)
      .then((response) => response.data),
  rejectManualPayment: (id: number) =>
    api.post(`/payments/${id}/reject-manual`).then((response) => response.data),
  categories: () =>
    api.get("/categories", { params: { limit: 100 } }).then((response) => response.data),
  createCategory: (payload: {
    name: string;
    parent_id?: number | null;
    sort_order?: number;
  }) => api.post("/categories", payload).then((response) => response.data),
  updateCategory: (id: number, payload: { name: string; parent_id?: number | null; sort_order?: number }) =>
    api.put(`/categories/${id}`, payload).then((response) => response.data),
  removeCategory: (id: number) =>
    api.delete(`/categories/${id}`).then((response) => response.data),
  collections: () => api.get("/collections").then((response) => response.data),
  banners: () => api.get("/banners").then((response) => response.data),
  createBanner: (payload: FormData | Record<string, string>) =>
    api.post("/banners", payload).then((response) => response.data),
  updateBanner: (id: number, payload: FormData | Record<string, string>) =>
    api.put(`/banners/${id}`, payload).then((response) => response.data),
  removeBanner: (id: number) =>
    api.delete(`/banners/${id}`).then((response) => response.data),
  homepageOccasions: () =>
    api.get("/homepage-occasions").then((response) => response.data),
  createHomepageOccasion: (payload: FormData | Record<string, string>) =>
    api.post("/homepage-occasions", payload).then((response) => response.data),
  updateHomepageOccasion: (id: number, payload: FormData | Record<string, string>) =>
    api.put(`/homepage-occasions/${id}`, payload).then((response) => response.data),
  removeHomepageOccasion: (id: number) =>
    api.delete(`/homepage-occasions/${id}`).then((response) => response.data),
  homepageCraftsmanship: () =>
    api.get("/homepage-craftsmanship").then((response) => response.data),
  updateHomepageCraftsmanship: (payload: FormData) =>
    api.put("/homepage-craftsmanship", payload).then((response) => response.data),
  vouchers: () => api.get("/vouchers").then((response) => response.data),
  createVoucher: (payload: Record<string, string | number>) =>
    api.post("/vouchers", payload).then((response) => response.data),
  removeVoucher: (id: number) =>
    api.delete(`/vouchers/${id}`).then((response) => response.data),
  customers: () =>
    api
      .get("/customers", { params: { limit: 100 } })
      .then((response) => response.data),
  reviews: () =>
    api
      .get("/review", { params: { limit: 100 } })
      .then((response) => response.data),
  approveReview: (id: number) =>
    api.patch(`/review/${id}/approve`).then((response) => response.data),
  rejectReview: (id: number) =>
    api.patch(`/review/${id}/reject`).then((response) => response.data),
  report: (type: string, params: Record<string, string>) =>
    api.get(`/reports/${type}`, { params }).then((response) => response.data),
};
