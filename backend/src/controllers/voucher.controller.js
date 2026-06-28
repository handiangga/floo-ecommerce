const VoucherService = require("../services/voucher.service");
const ResponseHelper = require("../helpers/response.helper");

class VoucherController {
  async index(req, res, next) {
    try {
      const result = await VoucherService.getAll(req.query);

      return ResponseHelper.success(
        res,
        result,
        "Vouchers retrieved successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async show(req, res, next) {
    try {
      const result = await VoucherService.getById(req.params.id);

      return ResponseHelper.success(
        res,
        result,
        "Voucher retrieved successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async store(req, res, next) {
    try {
      const result = await VoucherService.create(req.body);

      return ResponseHelper.created(
        res,
        result,
        "Voucher created successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const result = await VoucherService.update(req.params.id, req.body);

      return ResponseHelper.success(
        res,
        result,
        "Voucher updated successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async destroy(req, res, next) {
    try {
      await VoucherService.delete(req.params.id);

      return ResponseHelper.success(res, null, "Voucher deleted successfully");
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new VoucherController();
