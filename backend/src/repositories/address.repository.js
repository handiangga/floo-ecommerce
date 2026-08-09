const { Address } = require("../../models");
const { Op } = require("sequelize");

class AddressRepository {
  async findAll({
    customer_id,
    limit,
    offset,
    search = "",
    status,
    sort = "createdAt",
    order = "DESC",
  }) {
    const where = {};

    if (customer_id) {
      where.customer_id = customer_id;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        {
          receiver_name: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          phone: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          city: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          district: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    return Address.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sort, order]],
    });
  }

  async findById(id) {
    return Address.findByPk(id);
  }

  async findByCustomer(customer_id) {
    return Address.findAll({
      where: { customer_id },
      order: [
        ["is_default", "DESC"],
        ["createdAt", "DESC"],
      ],
    });
  }

  async findByCustomerAndLabel(customer_id, label) {
    return Address.findOne({
      where: { customer_id, label },
      order: [
        ["is_default", "DESC"],
        ["createdAt", "DESC"],
      ],
    });
  }

  async findDefault(customer_id) {
    return Address.findOne({
      where: {
        customer_id,
        is_default: true,
      },
    });
  }

  async resetDefault(customer_id) {
    return Address.update(
      {
        is_default: false,
      },
      {
        where: {
          customer_id,
        },
      },
    );
  }

  async create(payload) {
    return Address.create(payload);
  }

  async update(id, payload) {
    await Address.update(payload, {
      where: { id },
    });

    return this.findById(id);
  }

  async delete(id) {
    return Address.destroy({
      where: { id },
    });
  }
}

module.exports = new AddressRepository();
