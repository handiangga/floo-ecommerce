require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const rateLimit = require("./middlewares/rate-limit");

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const localOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
const configuredOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = isProduction ? configuredOrigins : [...new Set([...localOrigins, ...configuredOrigins])];

// ======================
// MIDDLEWARE
// ======================

app.set("trust proxy", isProduction ? 1 : false);

app.use(cookieParser());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Origin is not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  }),
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(compression());

if (!isProduction) app.use(morgan("dev"));

app.use(express.json({ limit: "1mb" }));

app.use(express.urlencoded({ extended: true, limit: "50kb" }));

// ======================
// HEALTH CHECK
// ======================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Floo Ecommerce API",
    version: "1.0.0",
  });
});

// ======================
// API
// ======================

app.use(
  "/api/v1",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Number(process.env.API_RATE_LIMIT_MAX || 600),
    keyPrefix: "api",
  }),
  routes,
);

// ======================
// 404
// ======================

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Endpoint Not Found",
  });
});

// ======================
// ERROR HANDLER
// ======================

app.use(errorHandler);

module.exports = app;
