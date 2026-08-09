"use strict";

const router = require("express").Router();
const RegionController = require("../controllers/region.controller");
const rateLimit = require("../middlewares/rate-limit");

router.use(rateLimit({ windowMs: 60 * 1000, max: 120, keyPrefix: "regions" }));
router.get("/provinces", RegionController.provinces);
router.get("/regencies/:provinceCode", RegionController.regencies);
router.get("/districts/:regencyCode", RegionController.districts);
router.get("/villages/:districtCode", RegionController.villages);

module.exports = router;
