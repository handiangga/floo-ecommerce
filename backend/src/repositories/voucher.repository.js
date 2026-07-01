const { Voucher } = require("../../models");
const { Op } = require("sequelize");

class VoucherRepository {
  async findAll({
    limit,
    offset,
    search = "",
    status,
    sort = "createdAt",
    order = "DESC",
  }) {
    const where = {};

    if (search) {
      where[Op.or] = [
        {
          code: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          name: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    if (status) {
      where.status = status;
    }

    return Voucher.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sort, order]],
    });
  }

  async findById(id) {
    return Voucher.findByPk(id);
  }

  async findByCode(code) {
    return Voucher.findOne({
      where: { code },
    });
  }

  async create(payload) {
    return Voucher.create(payload);
  }

  async update(id, payload, transaction = null) {
    await Voucher.update(payload, {
      where: { id },
      transaction,
    });

    return this.findById(id);
  }

  async delete(id) {
    return Voucher.destroy({
      where: { id },
    });
  }
}

module.exports = new VoucherRepository();
