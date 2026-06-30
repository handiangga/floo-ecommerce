const jwt = require("jsonwebtoken");

const CustomerAuthRepository = require("../repositories/customer-auth.repository");

class CustomerAuthService {
  async register(payload) {
    const email = await CustomerAuthRepository.findByEmail(payload.email);

    if (email) {
      throw new Error("Email already exists");
    }

    const phone = await CustomerAuthRepository.findByPhone(payload.phone);

    if (phone) {
      throw new Error("Phone already exists");
    }

    const customer = await CustomerAuthRepository.create(payload);

    return customer;
  }

  async login(email, password) {
    const customer = await CustomerAuthRepository.findByEmail(email);

    if (!customer) {
      throw new Error("Email or password is incorrect");
    }

    const valid = await customer.comparePassword(password);

    if (!valid) {
      throw new Error("Email or password is incorrect");
    }

    const token = jwt.sign(
      {
        id: customer.id,
        type: "CUSTOMER",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      },
    );

    const customerData = customer.toJSON();

    return {
      token,
      customer: customerData,
    };
  }

  async profile(id) {
    const customer = await CustomerAuthRepository.findById(id);

    if (!customer) {
      throw new Error("Customer not found");
    }

    return customer;
  }

  async updateProfile(id, payload) {
    const customer = await CustomerAuthRepository.findById(id);

    if (!customer) {
      throw new Error("Customer not found");
    }

    if (payload.email && payload.email !== customer.email) {
      const email = await CustomerAuthRepository.findByEmail(payload.email);

      if (email) {
        throw new Error("Email already exists");
      }
    }

    if (payload.phone && payload.phone !== customer.phone) {
      const phone = await CustomerAuthRepository.findByPhone(payload.phone);

      if (phone) {
        throw new Error("Phone already exists");
      }
    }

    return CustomerAuthRepository.update(id, payload);
  }

  async changePassword(id, oldPassword, newPassword) {
    const customer = await CustomerAuthRepository.findById(id);

    if (!customer) {
      throw new Error("Customer not found");
    }

    const valid = await customer.comparePassword(oldPassword);

    if (!valid) {
      throw new Error("Old password is incorrect");
    }

    return CustomerAuthRepository.update(id, {
      password: newPassword,
    });
  }
}

module.exports = new CustomerAuthService();
