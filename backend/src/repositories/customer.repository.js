const { Customer } = require("../../models");
const { Op } = require("sequelize");

class CustomerRepository {
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
          name: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          email: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          phone: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    if (status) {
      where.status = status;
    }

    return Customer.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sort, order]],
    });
  }

  async findById(id) {
    return Customer.findByPk(id);
  }

  async findByEmail(email) {
    return Customer.findOne({
      where: { email },
    });
  }

  async findByPhone(phone) {
    return Customer.findOne({
      where: { phone },
    });
  }

  async create(payload) {
    return Customer.create(payload);
  }

  async update(id, payload) {
    await Customer.update(payload, {
      where: { id },
    });

    return this.findById(id);
  }

  async delete(id) {
    return Customer.destroy({
      where: { id },
    });
  }
}

module.exports = new CustomerRepository();
