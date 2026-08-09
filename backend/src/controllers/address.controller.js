const AddressService = require("../services/address.service");
const ResponseHelper = require("../helpers/response.helper");

class AddressController {
  async index(req, res, next) {
    try {
      req.query.customer_id = req.customer.id;

      const result = await AddressService.getAll(req.query);

      return ResponseHelper.pagination(
        res,
        result.data,
        result.meta,
        "Addresses retrieved successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async show(req, res, next) {
    try {
      const result = await AddressService.getById(req.params.id);

      if (result.customer_id !== req.customer.id) {
        return ResponseHelper.forbidden(res);
      }

      return ResponseHelper.success(
        res,
        result,
        "Address retrieved successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async store(req, res, next) {
    try {
      if (req.body.label === "HOME") {
        const existingHome = await AddressService.getHomeAddress(
          req.customer.id,
        );
        if (existingHome) {
          return ResponseHelper.conflict(
            res,
            "Alamat Rumah sudah ada. Gunakan alamat yang tersimpan atau hapus alamat Rumah lama terlebih dahulu.",
          );
        }
      }

      req.body.customer_id = req.customer.id;

      const result = await AddressService.create(req.body);

      return ResponseHelper.created(
        res,
        result,
        "Address created successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const address = await AddressService.getById(req.params.id);

      if (address.customer_id !== req.customer.id) {
        return ResponseHelper.forbidden(res);
      }

      const result = await AddressService.update(req.params.id, req.body);

      return ResponseHelper.updated(
        res,
        result,
        "Address updated successfully",
      );
    } catch (err) {
      next(err);
    }
  }

  async destroy(req, res, next) {
    try {
      const address = await AddressService.getById(req.params.id);

      if (address.customer_id !== req.customer.id) {
        return ResponseHelper.forbidden(res);
      }

      await AddressService.delete(req.params.id);

      return ResponseHelper.deleted(res, "Address deleted successfully");
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AddressController();
