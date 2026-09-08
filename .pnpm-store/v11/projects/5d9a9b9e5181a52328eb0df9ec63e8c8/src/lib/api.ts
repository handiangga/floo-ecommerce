import axios from "axios";
import { AdminSession, CustomerSession } from "@/lib/session";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAdminPage =
        typeof window !== "undefined" &&
        (window.location.hostname === (process.env.NEXT_PUBLIC_ADMIN_HOST || "admin.floofashionn.com") ||
          (window.location.hostname === "localhost" && window.location.pathname.startsWith("/admin"))) &&
        !window.location.pathname.endsWith("/login");
      if (isAdminPage) AdminSession.clear();
      else CustomerSession.clear();
    }

    return Promise.reject(error);
  },
);

export default api;
