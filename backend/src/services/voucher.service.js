const VoucherRepository = require("../repositories/voucher.repository");
const PaginationHelper = require("../helpers/pagination.helper");

class VoucherService {
  async getAll(query) {
    const { page, limit, offset } = PaginationHelper.getPagination(query);

    const result = await VoucherRepository.findAll({
      limit,
      offset,
      search: query.search || "",
      status: query.status,
      sort: query.sort || "createdAt",
      order: query.order || "DESC",
    });

    return {
      data: result.rows,
      meta: PaginationHelper.getMeta(result.count, page, limit),
    };
  }

  async getById(id) {
    const voucher = await VoucherRepository.findById(id);

    if (!voucher) {
      throw new Error("Voucher not found");
    }

    return voucher;
  }

  async create(payload) {
    const exist = await VoucherRepository.findByCode(payload.code);

    if (exist) {
      throw new Error("Voucher code already exists");
    }

    payload.used = 0;

    return VoucherRepository.create(payload);
  }

  async update(id, payload) {
    const voucher = await VoucherRepository.findById(id);

    if (!voucher) {
      throw new Error("Voucher not found");
    }

    if (payload.code) {
      const exist = await VoucherRepository.findByCode(payload.code);

      if (exist && Number(exist.id) !== Number(id)) {
        throw new Error("Voucher code already exists");
      }
    }

    return VoucherRepository.update(id, payload);
  }

  async delete(id) {
    const voucher = await VoucherRepository.findById(id);

    if (!voucher) {
      throw new Error("Voucher not found");
    }

    await VoucherRepository.delete(id);

    return true;
  }
}

module.exports = new VoucherService();
