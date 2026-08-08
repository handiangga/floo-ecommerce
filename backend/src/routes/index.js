const router = require("express").Router();
const { sequelize } = require("../../models");
const readinessTimeoutMs = Number(process.env.HEALTHCHECK_DB_TIMEOUT_MS || 4000);

function withTimeout(promise, timeoutMs) {
  let timeout;
  const timeoutPromise = new Promise((_, reject) => {
    timeout = setTimeout(() => reject(new Error("Database readiness timed out")), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeout));
}

router.get("/health", (req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({
    success: true,
    status: "ok",
    service: "floo-api",
    uptime_seconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

router.get("/health/ready", async (req, res) => {
  res.set("Cache-Control", "no-store");

  try {
    await withTimeout(sequelize.authenticate(), readinessTimeoutMs);
    return res.json({
      success: true,
      status: "ready",
      service: "floo-api",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(503).json({
      success: false,
      status: "not_ready",
      service: "floo-api",
      database: "unavailable",
    });
  }
});

// ======================
// AUTH
// ======================
router.use("/auth", require("./auth.route"));
router.use("/customer-auth", require("./customer-auth.route"));

// ======================
// MASTER
// ======================
router.use("/categories", require("./category.route"));
router.use("/colors", require("./color.route"));
router.use("/sizes", require("./size.route"));
router.use("/banners", require("./banner.route"));
router.use("/vouchers", require("./voucher.route"));

// ======================
// PRODUCT
// ======================
router.use("/products", require("./product.route"));
router.use("/product-images", require("./product-image.route"));
router.use("/product-variants", require("./product-variant.route"));

// ======================
// CUSTOMER
// ======================

router.use("/customers", require("./customer.route"));
router.use("/addresses", require("./address.route"));

// ======================
// SHOPPING
// ======================

router.use("/cart", require("./cart.route"));
router.use("/wishlist", require("./wishlist.route"));

// ======================
// ORDER
// ======================

router.use("/orders", require("./order.route"));
router.use("/payments", require("./payment.route"));
router.use("/shipments", require("./shipment.route"));

// ======================
// DASHBOARD
// ======================

router.use("/dashboard", require("./dashboard.route"));
router.use("/reports", require("./report.route"));
router.use("/review", require("./review.route"));
router.use("/notifications", require("./notification.route"));

module.exports = router;
