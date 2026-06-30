const CustomerService = require("../services/customer.service");
const ResponseHelper = require("../helpers/response.helper");

class CustomerController {
  async index(req, res, next) {
    try {
      const result = await CustomerService.getAll(req.query);

      return ResponseHelper.pagination(
        res,
        result.data,
        result.meta,
        "Customers retrieved successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async show(req, res, next) {
    try {
      const result = await CustomerService.getById(req.params.id);

      return ResponseHelper.success(
        res,
        result,
        "Customer retrieved successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async store(req, res, next) {
    try {
      const result = await CustomerService.create(req.body);

      return ResponseHelper.created(
        res,
        result,
        "Customer created successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const result = await CustomerService.update(req.params.id, req.body);

      return ResponseHelper.updated(
        res,
        result,
        "Customer updated successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async destroy(req, res, next) {
    try {
      await CustomerService.delete(req.params.id);

      return ResponseHelper.deleted(res, "Customer deleted successfully");
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CustomerController();
