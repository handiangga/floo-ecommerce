const { Customer } = require("../../models");

class CustomerAuthRepository {
  async findById(id) {
    return Customer.findByPk(id);
  }

  async findByEmail(email) {
    return Customer.findOne({
      where: {
        email,
      },
    });
  }

  async findByPhone(phone) {
    return Customer.findOne({
      where: {
        phone,
      },
    });
  }

  async create(payload) {
    return Customer.create(payload);
  }

  async update(id, payload) {
    await Customer.update(payload, {
      where: {
        id,
      },
    });

    return this.findById(id);
  }
}

module.exports = new CustomerAuthRepository();
