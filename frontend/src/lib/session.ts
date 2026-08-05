export const CUSTOMER_TOKEN_KEY = "access_token";
export const ADMIN_TOKEN_KEY = "admin_access_token";

const canUseStorage = () => typeof window !== "undefined";

export const CustomerSession = {
  get: () => canUseStorage() ? localStorage.getItem(CUSTOMER_TOKEN_KEY) : null,
  has: () => Boolean(CustomerSession.get()),
  save: (token: string) => { if (canUseStorage()) localStorage.setItem(CUSTOMER_TOKEN_KEY, token); },
  clear: () => { if (canUseStorage()) localStorage.removeItem(CUSTOMER_TOKEN_KEY); },
};

export const AdminSession = {
  get: () => canUseStorage() ? localStorage.getItem(ADMIN_TOKEN_KEY) : null,
  has: () => Boolean(AdminSession.get()),
  save: (token: string) => { if (canUseStorage()) localStorage.setItem(ADMIN_TOKEN_KEY, token); },
  clear: () => { if (canUseStorage()) localStorage.removeItem(ADMIN_TOKEN_KEY); },
};
