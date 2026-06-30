const router = require("express").Router();

const CartController = require("../controllers/cart.controller");

const customerAuthentication = require("../middlewares/customer-authentication");
const validation = require("../middlewares/validation");

const CartValidation = require("../validations/cart.validation");

router.use(customerAuthentication);

router.get("/", CartController.index);

router.post(
  "/items",
  validation(CartValidation.addItem),
  CartController.addItem,
);

router.put(
  "/items/:id",
  validation(CartValidation.updateQty),
  CartController.updateQty,
);

router.patch("/items/:id/toggle", CartController.toggleSelected);

router.delete("/items/:id", CartController.removeItem);

router.delete("/clear", CartController.clear);

module.exports = router;
