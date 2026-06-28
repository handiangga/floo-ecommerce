const router = require("express").Router();

const VoucherController = require("../controllers/voucher.controller");

const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");
const validation = require("../middlewares/validation");

const VoucherValidation = require("../validations/voucher.validation");

router.get("/", VoucherController.index);

router.get("/:id", VoucherController.show);

router.post(
  "/",
  authentication,
  authorization("OWNER", "ADMIN"),
  validation(VoucherValidation.create),
  VoucherController.store,
);

router.put(
  "/:id",
  authentication,
  authorization("OWNER", "ADMIN"),
  validation(VoucherValidation.update),
  VoucherController.update,
);

router.delete(
  "/:id",
  authentication,
  authorization("OWNER", "ADMIN"),
  VoucherController.destroy,
);

module.exports = router;
