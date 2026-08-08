export const CUSTOMER_SESSION_KEY = "floo_customer_session";
export const ADMIN_SESSION_KEY = "floo_admin_session";

const canUseStorage = () => typeof window !== "undefined";

export const CustomerSession = {
  has: () => canUseStorage() && localStorage.getItem(CUSTOMER_SESSION_KEY) === "1",
  save: () => {
    if (canUseStorage()) {
      localStorage.removeItem("access_token");
      localStorage.setItem(CUSTOMER_SESSION_KEY, "1");
    }
  },
  clear: () => {
    if (canUseStorage()) {
      localStorage.removeItem("access_token");
      localStorage.removeItem(CUSTOMER_SESSION_KEY);
    }
  },
};

export const AdminSession = {
  has: () => canUseStorage() && localStorage.getItem(ADMIN_SESSION_KEY) === "1",
  save: () => {
    if (canUseStorage()) {
      localStorage.removeItem("admin_access_token");
      localStorage.setItem(ADMIN_SESSION_KEY, "1");
    }
  },
  clear: () => {
    if (canUseStorage()) {
      localStorage.removeItem("admin_access_token");
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  },
};
