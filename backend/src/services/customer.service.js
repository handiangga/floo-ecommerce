const CustomerRepository = require("../repositories/customer.repository");

const PaginationHelper = require("../helpers/pagination.helper");

class CustomerService {
  async getAll(query) {
    const { page, limit, offset } = PaginationHelper.getPagination(query);

    const result = await CustomerRepository.findAll({
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
    const customer = await CustomerRepository.findById(id);

    if (!customer) {
      throw new Error("Customer not found");
    }

    return customer;
  }

  async create(payload) {
    const email = await CustomerRepository.findByEmail(payload.email);

    if (email) {
      throw new Error("Email already exists");
    }

    const phone = await CustomerRepository.findByPhone(payload.phone);

    if (phone) {
      throw new Error("Phone already exists");
    }

    return CustomerRepository.create(payload);
  }

  async update(id, payload) {
    const customer = await CustomerRepository.findById(id);

    if (!customer) {
      throw new Error("Customer not found");
    }

    if (payload.email && payload.email !== customer.email) {
      const email = await CustomerRepository.findByEmail(payload.email);

      if (email) {
        throw new Error("Email already exists");
      }
    }

    if (payload.phone && payload.phone !== customer.phone) {
      const phone = await CustomerRepository.findByPhone(payload.phone);

      if (phone) {
        throw new Error("Phone already exists");
      }
    }

    return CustomerRepository.update(id, payload);
  }

  async delete(id) {
    const customer = await CustomerRepository.findById(id);

    if (!customer) {
      throw new Error("Customer not found");
    }

    await CustomerRepository.delete(id);

    return true;
  }
}

module.exports = new CustomerService();
