const router = require("express").Router();

const CustomerController = require("../controllers/customer.controller");

const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");
const validation = require("../middlewares/validation");

const CustomerValidation = require("../validations/customer.validation");

router.get(
  "/",
  authentication,
  authorization("OWNER", "ADMIN"),
  CustomerController.index,
);

router.get(
  "/:id",
  authentication,
  authorization("OWNER", "ADMIN"),
  CustomerController.show,
);

router.post(
  "/",
  authentication,
  authorization("OWNER", "ADMIN"),
  validation(CustomerValidation.create),
  CustomerController.store,
);

router.put(
  "/:id",
  authentication,
  authorization("OWNER", "ADMIN"),
  validation(CustomerValidation.update),
  CustomerController.update,
);

router.delete(
  "/:id",
  authentication,
  authorization("OWNER", "ADMIN"),
  CustomerController.destroy,
);

module.exports = router;
