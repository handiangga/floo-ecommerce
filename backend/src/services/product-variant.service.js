const ProductVariantRepository = require("../repositories/product-variant.repository");

const ProductRepository = require("../repositories/product.repository");
const ColorRepository = require("../repositories/color.repository");
const SizeRepository = require("../repositories/size.repository");

const PaginationHelper = require("../helpers/pagination.helper");
const SKUHelper = require("../helpers/sku.helper");

class ProductVariantService {
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

    const color = await ColorRepository.findById(payload.color_id);

    if (!color) {
      throw new Error("Color not found");
    }

    const size = await SizeRepository.findById(payload.size_id);

    if (!size) {
      throw new Error("Size not found");
    }

    const duplicate = await ProductVariantRepository.findDuplicate(
      payload.product_id,
      payload.color_id,
      payload.size_id,
    );

    if (duplicate) {
      throw new Error("Variant already exists");
    }

    if (payload.discount_price && payload.discount_price > payload.price) {
      throw new Error("Discount price cannot exceed price");
    }

    if (payload.min_order && payload.min_order > payload.stock) {
      throw new Error("Minimum order cannot exceed stock");
    }

    payload.sku = SKUHelper.generate(
      product.category.name,
      product.id,
      color.name,
      size.name,
    );

    return ProductVariantRepository.create(payload);
  }

  async update(id, payload) {
    const variant = await ProductVariantRepository.findById(id);

    if (!variant) {
      throw new Error("Product variant not found");
    }

    const duplicate = await ProductVariantRepository.findDuplicateExcept(
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
