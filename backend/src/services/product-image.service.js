const ProductRepository = require("../repositories/product.repository");
const ProductImageRepository = require("../repositories/product-image.repository");
const SupabaseService = require("./supabase.service");
const ImageHelper = require("../helpers/image.helper");

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

  async create(payload, files = []) {
    const product = await ProductRepository.findById(payload.product_id);

    if (!product) {
      throw new Error("Product not found");
    }

    const uploads = files.length
      ? await Promise.all(files.map(async (file, index) => {
          const optimized = await ImageHelper.product(file);
          const upload = await SupabaseService.upload(optimized, "products");
          return {
            ...payload,
            image: upload.public_url,
            is_primary: index === 0 && payload.is_primary !== "false",
            sort_order: Number(payload.sort_order || 0) + index,
          };
        }))
      : [{ ...payload, is_primary: payload.is_primary === true || payload.is_primary === "true" }];

    if (uploads.some((item) => item.is_primary)) {
      await ProductImageRepository.resetPrimary(payload.product_id, payload.color_id);
    }

    return Promise.all(uploads.map((item) => ProductImageRepository.create(item)));
  }

  async delete(id) {
    const image = await ProductImageRepository.findById(id);

    if (!image) {
      throw new Error("Product image not found");
    }

    await ProductImageRepository.delete(id);

    return true;
  }

  async reorder(product_id, imageIds) {
    const images = await ProductImageRepository.findAll(product_id);

    if (images.length !== imageIds.length) {
      throw new Error("All product images must be included when reordering");
    }

    const existingIds = new Set(images.map((image) => Number(image.id)));
    const requestedIds = imageIds.map(Number);

    if (
      new Set(requestedIds).size !== requestedIds.length ||
      requestedIds.some((imageId) => !existingIds.has(imageId))
    ) {
      throw new Error("Invalid product image order");
    }

    await ProductImageRepository.resetPrimary(product_id);

    await Promise.all(
      requestedIds.map((imageId, index) =>
        ProductImageRepository.update(imageId, {
          sort_order: index,
          is_primary: index === 0,
        }),
      ),
    );

    return ProductImageRepository.findAll(product_id);
  }
}

module.exports = new ProductImageService();
