import axios from "axios";
import { AdminSession, CustomerSession } from "@/lib/session";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    const isAuthPage = path === "/login" || path === "/register" || path === "/admin/login" || path.startsWith("/auth/");
    const isAdminArea = path.startsWith("/admin") && path !== "/admin/login";
    const token = isAuthPage ? null : (isAdminArea ? AdminSession.get() : CustomerSession.get());

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAdminPage = typeof window !== "undefined" && window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login";
      if (isAdminPage) AdminSession.clear();
      else CustomerSession.clear();
    }

    return Promise.reject(error);
  },
);

export default api;
