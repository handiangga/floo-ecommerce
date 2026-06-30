const AddressRepository = require("../repositories/address.repository");
const CustomerRepository = require("../repositories/customer.repository");

const PaginationHelper = require("../helpers/pagination.helper");

class AddressService {
  async getAll(query) {
    const { page, limit, offset } = PaginationHelper.getPagination(query);

    const result = await AddressRepository.findAll({
      customer_id: query.customer_id,
      status: query.status,
      search: query.search || "",
      limit,
      offset,
      sort: query.sort || "createdAt",
      order: query.order || "DESC",
    });

    return {
      data: result.rows,
      meta: PaginationHelper.getMeta(result.count, page, limit),
    };
  }

  async getById(id) {
    const address = await AddressRepository.findById(id);

    if (!address) {
      throw new Error("Address not found");
    }

    return address;
  }

  async getByCustomer(customer_id) {
    return AddressRepository.findByCustomer(customer_id);
  }

  async create(payload) {
    const customer = await CustomerRepository.findById(payload.customer_id);

    if (!customer) {
      throw new Error("Customer not found");
    }

    if (payload.is_default) {
      await AddressRepository.resetDefault(payload.customer_id);
    }

    return AddressRepository.create(payload);
  }

  async update(id, payload) {
    const address = await AddressRepository.findById(id);

    if (!address) {
      throw new Error("Address not found");
    }

    if (payload.is_default) {
      await AddressRepository.resetDefault(address.customer_id);
    }

    return AddressRepository.update(id, payload);
  }

  async delete(id) {
    const address = await AddressRepository.findById(id);

    if (!address) {
      throw new Error("Address not found");
    }

    await AddressRepository.delete(id);

    return true;
  }
}

module.exports = new AddressService();
