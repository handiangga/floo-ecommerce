const router = require("express").Router();

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

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API Running",
  });
});

module.exports = router;
