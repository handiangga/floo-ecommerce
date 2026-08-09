const router = require("express").Router();
const Controller = require("../controllers/homepage-occasion.controller");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");
const validation = require("../middlewares/validation");
const upload = require("../middlewares/upload");
const rules = require("../validations/homepage-occasion.validation");

router.get("/", Controller.index);
router.get("/:id", Controller.show);
router.post("/", authentication, authorization("OWNER", "ADMIN"), upload.single("image_file"), validation(rules.create), Controller.store);
router.put("/:id", authentication, authorization("OWNER", "ADMIN"), upload.single("image_file"), validation(rules.update), Controller.update);
router.delete("/:id", authentication, authorization("OWNER", "ADMIN"), Controller.destroy);

module.exports = router;
