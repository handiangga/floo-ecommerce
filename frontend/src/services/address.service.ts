import api from "@/lib/api";

export type AddressPayload = { receiver_name: string; phone: string; label: "HOME" | "OFFICE" | "OTHER"; province: string; city: string; district: string; subdistrict: string; postal_code: string; address: string; notes?: string; is_default?: boolean };
export const AddressService = {
  getAll: () => api.get("/addresses", { params: { limit: 50 } }).then((response) => response.data),
  create: (payload: AddressPayload) => api.post("/addresses", payload).then((response) => response.data),
  remove: (id: number) => api.delete(`/addresses/${id}`).then((response) => response.data),
};
