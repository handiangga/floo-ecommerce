"use strict";

const reviewService = require("../services/review.service");
const ResponseHelper = require("../helpers/response.helper");

class ReviewController {
  async create(req, res, next) {
    try {
      const result = await reviewService.create(req.body);

      return ResponseHelper.success(
        res,
        result,
        "Review created successfully",
        201,
      );
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const result = await reviewService.findAll(req.query);

      return ResponseHelper.success(
        res,
        result,
        "Reviews retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const result = await reviewService.findById(req.params.id);

      return ResponseHelper.success(
        res,
        result,
        "Review retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async approve(req, res, next) {
    try {
      const result = await reviewService.approve(req.params.id);

      return ResponseHelper.success(
        res,
        result,
        "Review approved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async reject(req, res, next) {
    try {
      const result = await reviewService.reject(req.params.id);

      return ResponseHelper.success(
        res,
        result,
        "Review rejected successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await reviewService.delete(req.params.id);

      return ResponseHelper.success(res, null, "Review deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  async summary(req, res, next) {
    try {
      const result = await reviewService.getSummary(req.params.productId);

      return ResponseHelper.success(
        res,
        result,
        "Review summary retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReviewController();
