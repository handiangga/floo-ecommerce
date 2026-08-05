import api from "@/lib/api";

export const CustomerAuthService = {
  register: (payload: { name: string; email: string; phone: string; password: string }) =>
    api.post("/customer-auth/register", payload).then((response) => response.data),
  login: (email: string, password: string) =>
    api
      .post("/customer-auth/login", { email, password })
      .then((response) => response.data),
  profile: () =>
    api.get("/customer-auth/profile").then((response) => response.data),
  updateProfile: (payload: {
    name: string;
    email: string;
    phone: string;
  }) =>
    api
      .put("/customer-auth/profile", payload)
      .then((response) => response.data),
  changePassword: (old_password: string, new_password: string) =>
    api.put("/customer-auth/change-password", { old_password, new_password }).then((response) => response.data),
};
