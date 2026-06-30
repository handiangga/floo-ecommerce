const router = require("express").Router();

const WishlistController = require("../controllers/wishlist.controller");

const customerAuthentication = require("../middlewares/customer-authentication");
const validation = require("../middlewares/validation");

const WishlistValidation = require("../validations/wishlist.validation");

router.use(customerAuthentication);

router.get("/", WishlistController.index);

router.post(
  "/",
  validation(WishlistValidation.create),
  WishlistController.store,
);

router.delete("/:productId", WishlistController.destroy);

module.exports = router;
