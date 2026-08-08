"use strict";

const COOKIE_MAX_AGE = Number(process.env.AUTH_COOKIE_MAX_AGE_MS || 7 * 24 * 60 * 60 * 1000);

function baseOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };
}

function options() {
  return { ...baseOptions(), maxAge: COOKIE_MAX_AGE };
}

function setCustomerCookie(res, token) {
  res.cookie("floo_customer_token", token, options());
}

function setAdminCookie(res, token) {
  res.cookie("floo_admin_token", token, options());
}

function clearCustomerCookie(res) {
  res.clearCookie("floo_customer_token", baseOptions());
}

function clearAdminCookie(res) {
  res.clearCookie("floo_admin_token", baseOptions());
}

module.exports = {
  setCustomerCookie,
  setAdminCookie,
  clearCustomerCookie,
  clearAdminCookie,
};
