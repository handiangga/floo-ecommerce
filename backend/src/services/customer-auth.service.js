const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const CustomerAuthRepository = require("../repositories/customer-auth.repository");

class CustomerAuthService {
  issueToken(customer) {
    return jwt.sign({ id: customer.id, type: "CUSTOMER" }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
  }
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

    const token = this.issueToken(customer);

    const customerData = customer.toJSON();

    return {
      token,
      customer: customerData,
    };
  }

  async googleCallback(code) {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI) throw new Error("Google OAuth is not configured");
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code, client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET, redirect_uri: process.env.GOOGLE_REDIRECT_URI, grant_type: "authorization_code" }) });
    if (!tokenResponse.ok) throw new Error("Google authorization failed");
    const tokens = await tokenResponse.json();
    const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { Authorization: `Bearer ${tokens.access_token}` } });
    if (!profileResponse.ok) throw new Error("Google profile could not be retrieved");
    const profile = await profileResponse.json();
    if (!profile.email || !profile.email_verified) throw new Error("A verified Google email is required");
    let customer = await CustomerAuthRepository.findByEmail(profile.email.toLowerCase());
    if (!customer) customer = await CustomerAuthRepository.create({ name: profile.name || profile.email.split("@")[0], email: profile.email.toLowerCase(), phone: `g${String(profile.sub).slice(-18)}`, password: crypto.randomBytes(24).toString("hex"), photo: profile.picture || null, status: "ACTIVE" });
    return { token: this.issueToken(customer), customer: customer.toJSON() };
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
