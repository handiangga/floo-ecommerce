const router = require("express").Router();

const AddressController = require("../controllers/address.controller");

const customerAuthentication = require("../middlewares/customer-authentication");
const validation = require("../middlewares/validation");

const AddressValidation = require("../validations/address.validation");

router.use(customerAuthentication);

router.get("/", AddressController.index);

router.get("/:id", AddressController.show);

router.post("/", validation(AddressValidation.create), AddressController.store);

router.put(
  "/:id",
  validation(AddressValidation.update),
  AddressController.update,
);

router.delete("/:id", AddressController.destroy);

module.exports = router;
