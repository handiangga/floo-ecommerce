"use strict";

const RegionService = require("../services/region.service");
const ResponseHelper = require("../helpers/response.helper");

class RegionController {
  async provinces(req, res, next) {
    try {
      return ResponseHelper.success(res, await RegionService.provinces());
    } catch (error) {
      next(error);
    }
  }
  async regencies(req, res, next) {
    try {
      return ResponseHelper.success(
        res,
        await RegionService.regencies(req.params.provinceCode),
      );
    } catch (error) {
      next(error);
    }
  }
  async districts(req, res, next) {
    try {
      return ResponseHelper.success(
        res,
        await RegionService.districts(req.params.regencyCode),
      );
    } catch (error) {
      next(error);
    }
  }
  async villages(req, res, next) {
    try {
      return ResponseHelper.success(
        res,
        await RegionService.villages(req.params.districtCode),
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RegionController();
