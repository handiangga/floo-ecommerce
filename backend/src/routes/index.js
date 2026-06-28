const router = require("express").Router();

// ======================
// AUTH
// ======================
router.use("/auth", require("./auth.route"));

// ======================
// MASTER
// ======================
router.use("/categories", require("./category.route"));

// router.use("/colors", require("./color.route"));
// router.use("/sizes", require("./size.route"));
// router.use("/banners", require("./banner.route"));
// router.use("/vouchers", require("./voucher.route"));

// ======================
// PRODUCT
// ======================

// router.use("/products", require("./product.route"));

// ======================
// CUSTOMER
// ======================

// router.use("/customers", require("./customer.route"));
// router.use("/addresses", require("./address.route"));

// ======================
// SHOPPING
// ======================

// router.use("/cart", require("./cart.route"));
// router.use("/wishlist", require("./wishlist.route"));

// ======================
// ORDER
// ======================

// router.use("/orders", require("./order.route"));
// router.use("/payments", require("./payment.route"));
// router.use("/shipments", require("./shipment.route"));

module.exports = router;
