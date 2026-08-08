"use strict";

function validateEnvironment() {
  if (process.env.NODE_ENV !== "production") return;

  const required = [
    "DATABASE_URL",
    "JWT_SECRET",
    "CRON_SECRET",
    "CORS_ORIGINS",
    "FRONTEND_URL",
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_BUCKET",
    "MIDTRANS_SERVER_KEY",
    "MIDTRANS_CLIENT_KEY",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_REDIRECT_URI",
  ];
  const missing = required.filter((name) => !process.env[name]);

  if (missing.length) {
    throw new Error(
      "Missing required production environment variables: " + missing.join(", "),
    );
  }

  if (process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters in production");
  }

  if (process.env.CRON_SECRET.length < 32) {
    throw new Error("CRON_SECRET must be at least 32 characters in production");
  }

  for (const variable of ["FRONTEND_URL", "GOOGLE_REDIRECT_URI"]) {
    let value;
    try {
      value = new URL(process.env[variable]);
    } catch {
      throw new Error(variable + " must be a valid URL");
    }
    if (value.protocol !== "https:") {
      throw new Error(variable + " must use HTTPS in production");
    }
  }

  if (process.env.MIDTRANS_IS_PRODUCTION !== "true") {
    throw new Error("MIDTRANS_IS_PRODUCTION must be true in production");
  }
}

module.exports = validateEnvironment;
