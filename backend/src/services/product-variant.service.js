const ProductVariantRepository = require("../repositories/product-variant.repository");

const ProductRepository = require("../repositories/product.repository");
const ColorRepository = require("../repositories/color.repository");
const SizeRepository = require("../repositories/size.repository");

const PaginationHelper = require("../helpers/pagination.helper");
const SKUHelper = require("../helpers/sku.helper");
const crypto = require("crypto");

class ProductVariantService {
  normalizeOptions(optionValues) {
    if (!Array.isArray(optionValues)) return [];
    return optionValues
      .map((option) => ({
        name: String(option?.name || "").trim(),
        value: String(option?.value || "").trim(),
      }))
      .filter((option) => option.name && option.value)
      .slice(0, 3);
  }

  getOptionKey(options) {
    return options
      .map((option) => `${option.name.toLocaleLowerCase("id-ID")}:${option.value.toLocaleLowerCase("id-ID")}`)
      .join("|");
  }

  optionHash(value) {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
      hash = (hash << 5) - hash + value.charCodeAt(index);
      hash |= 0;
    }
    return Math.abs(hash).toString(36).toUpperCase();
  }

  async ensureColor(name) {
    const existing = await ColorRepository.findByName(name);
    if (existing) return existing;
    // The legacy Color table requires a real HEX code, while the current
    // product form accepts human labels such as navy or maroon. A SHA digest
    // always produces valid hexadecimal characters.
    const hex = crypto.createHash("sha256").update(String(name)).digest("hex").slice(0, 6);
    try {
      return await ColorRepository.create({ name: String(name).trim(), code: `#${hex}`, status: "ACTIVE" });
    } catch (error) {
      // Another request may have created the same label between lookup and
      // insert. Reuse it instead of failing the whole product creation.
      if (error?.name === "SequelizeUniqueConstraintError") {
        const duplicate = await ColorRepository.findByName(name);
        if (duplicate) return duplicate;
      }
      throw error;
    }
  }

  async ensureSize(name) {
    const existing = await SizeRepository.findByName(name);
    if (existing) return existing;
    try {
      return await SizeRepository.create({ name: String(name).trim(), status: "ACTIVE" });
    } catch (error) {
      if (error?.name === "SequelizeUniqueConstraintError") {
        const duplicate = await SizeRepository.findByName(name);
        if (duplicate) return duplicate;
      }
      throw error;
    }
  }

  async getAll(query) {
    const { page, limit, offset } = PaginationHelper.getPagination(query);

    const result = await ProductVariantRepository.findAll({
      limit,
      offset,
      product_id: query.product_id,
      color_id: query.color_id,
      size_id: query.size_id,
      is_ready_stock: query.is_ready_stock,
      status: query.status,
      search: query.search || "",
      sort: query.sort || "createdAt",
      order: query.order || "DESC",
    });

    return {
      data: result.rows,
      meta: PaginationHelper.getMeta(result.count, page, limit),
    };
  }

  async getById(id) {
    const variant = await ProductVariantRepository.findById(id);

    if (!variant) {
      throw new Error("Product variant not found");
    }

    return variant;
  }

  async getByProduct(product_id) {
    return ProductVariantRepository.findByProduct(product_id);
  }

  async create(payload) {
    const product = await ProductRepository.findById(payload.product_id);

    if (!product) {
      throw new Error("Product not found");
    }

    const optionValues = this.normalizeOptions(payload.option_values);
    let color;
    let size;
    let duplicate;

    if (optionValues.length) {
      const optionKey = this.getOptionKey(optionValues);
      duplicate = await ProductVariantRepository.findDuplicateOptionKey(payload.product_id, optionKey);
      if (duplicate) throw new Error("Variant already exists");

      color = await this.ensureColor(optionValues[0].value);
      // The internal Size record keeps every three-option combination unique,
      // while option_values remains the clean label shown to customers.
      const sizeLabel = optionValues.length > 2
        ? `V-${this.optionHash(optionKey).slice(0, 16)}`
        : (optionValues[1]?.value || "Satuan");
      size = await this.ensureSize(sizeLabel);
      payload.color_id = color.id;
      payload.size_id = size.id;
      payload.option_values = optionValues;
      payload.option_key = optionKey;
    } else {
      color = await ColorRepository.findById(payload.color_id);
      size = await SizeRepository.findById(payload.size_id);
      if (!color) throw new Error("Color not found");
      if (!size) throw new Error("Size not found");
      duplicate = await ProductVariantRepository.findDuplicate(payload.product_id, payload.color_id, payload.size_id);
    }

    if (duplicate) {
      throw new Error("Variant already exists");
    }

    if (payload.discount_price && payload.discount_price > payload.price) {
      throw new Error("Discount price cannot exceed price");
    }

    if (payload.min_order && payload.min_order > payload.stock) {
      throw new Error("Minimum order cannot exceed stock");
    }

    const baseSku = SKUHelper.generate(
      product.category.name,
      product.id,
      color.name,
      size.name,
    );
    payload.sku = optionValues.length
      ? `${baseSku}-${this.optionHash(payload.option_key).slice(0, 6)}`
      : baseSku;
    // Availability is configured once at product level so every variant has
    // the same shipping promise shown to the customer.
    payload.is_ready_stock = product.is_ready_stock;
    payload.is_preorder = product.is_preorder;
    payload.preorder_days = product.preorder_days;

    return ProductVariantRepository.create(payload);
  }

  async update(id, payload) {
    const variant = await ProductVariantRepository.findById(id);

    if (!variant) {
      throw new Error("Product variant not found");
    }

    const optionValues = payload.option_values ? this.normalizeOptions(payload.option_values) : null;
    if (optionValues?.length) {
      payload.option_values = optionValues;
      payload.option_key = this.getOptionKey(optionValues);
      const duplicate = await ProductVariantRepository.findDuplicateOptionKey(variant.product_id, payload.option_key, id);
      if (duplicate) throw new Error("Variant already exists");
    }

    const duplicate = optionValues?.length
      ? null
      : await ProductVariantRepository.findDuplicateExcept(
        id,
        payload.product_id ?? variant.product_id,
        payload.color_id ?? variant.color_id,
        payload.size_id ?? variant.size_id,
      );

    if (duplicate) {
      throw new Error("Variant already exists");
    }

    const price = payload.price ?? variant.price;

    const discount = payload.discount_price ?? variant.discount_price;

    if (discount && discount > price) {
      throw new Error("Discount price cannot exceed price");
    }

    const stock = payload.stock ?? variant.stock;

    const minOrder = payload.min_order ?? variant.min_order;

    if (minOrder > stock) {
      throw new Error("Minimum order cannot exceed stock");
    }

    return ProductVariantRepository.update(id, payload);
  }

  async delete(id) {
    const variant = await ProductVariantRepository.findById(id);

    if (!variant) {
      throw new Error("Product variant not found");
    }

    await ProductVariantRepository.delete(id);

    return true;
  }
}

module.exports = new ProductVariantService();
