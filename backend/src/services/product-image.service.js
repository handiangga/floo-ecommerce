const ProductRepository = require("../repositories/product.repository");
const ProductImageRepository = require("../repositories/product-image.repository");

class ProductImageService {
  async getAll(product_id) {
    console.log("product_id:", product_id);

    const product = await ProductRepository.findById(product_id);

    console.log("product:", product);
    if (!product) {
      throw new Error("Product not found");
    }

    return ProductImageRepository.findAll(product_id);
  }

  async create(payload) {
    const product = await ProductRepository.findById(payload.product_id);

    if (!product) {
      throw new Error("Product not found");
    }

    if (payload.is_primary) {
      await ProductImageRepository.resetPrimary(
        payload.product_id,
        payload.color_id,
      );
    }

    return ProductImageRepository.create(payload);
  }

  async delete(id) {
    const image = await ProductImageRepository.findById(id);

    if (!image) {
      throw new Error("Product image not found");
    }

    await ProductImageRepository.delete(id);

    return true;
  }
}

module.exports = new ProductImageService();
