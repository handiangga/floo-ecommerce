const router = require("express").Router();
const Controller = require("../controllers/homepage-craftsmanship.controller");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");
const upload = require("../middlewares/upload");

router.get("/", Controller.show);
router.put("/", authentication, authorization("OWNER", "ADMIN"), upload.fields([
  { name: "image_0", maxCount: 1 }, { name: "image_1", maxCount: 1 },
  { name: "image_2", maxCount: 1 }, { name: "image_3", maxCount: 1 },
]), Controller.update);

module.exports = router;
