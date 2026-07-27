const ProductRepository = require("../repositories/product.repository");
const CategoryRepository = require("../repositories/category.repository");
const SupabaseService = require("./supabase.service");
const ImageHelper = require("../helpers/image.helper");

const PaginationHelper = require("../helpers/pagination.helper");
const SlugHelper = require("../helpers/slug.helper");

class ProductService {
  async getAll(query) {
    const { page, limit, offset } = PaginationHelper.getPagination(query);

    const result = await ProductRepository.findAll({
      limit,
      offset,
      search: query.search || "",
      category_id: query.category_id,
      status: query.status,
      is_featured:
        query.is_featured !== undefined
          ? query.is_featured === "true"
          : undefined,
      sort: query.sort || "createdAt",
      order: query.order || "DESC",
    });

    return {
      data: result.rows,
      meta: PaginationHelper.getMeta(result.count, page, limit),
    };
  }

  async getById(id) {
    const product = await ProductRepository.findById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }

  async getBySlug(slug) {
    const product = await ProductRepository.findBySlug(slug);

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }

  async create(payload, file) {
    const category = await CategoryRepository.findById(payload.category_id);

    if (!category) {
      throw new Error("Category not found");
    }

    payload.slug = SlugHelper.generate(payload.name);

    const exist = await ProductRepository.findBySlug(payload.slug);

    if (exist) {
      throw new Error("Product already exists");
    }

    if (file) {
      const optimized = await ImageHelper.product(file);

      const upload = await SupabaseService.upload(optimized, "products");

      payload.image_url = upload.public_url;
      payload.image_path = upload.path;
    }

    return ProductRepository.create(payload);
  }

  async update(id, payload, file) {
    const product = await ProductRepository.findById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    if (payload.category_id) {
      const category = await CategoryRepository.findById(payload.category_id);

      if (!category) {
        throw new Error("Category not found");
      }
    }

    if (payload.name) {
      payload.slug = SlugHelper.generate(payload.name);

      const exist = await ProductRepository.findBySlug(payload.slug);

      if (exist && Number(exist.id) !== Number(id)) {
        throw new Error("Product already exists");
      }
    }

    if (file) {
      if (product.image_path) {
        await SupabaseService.remove(product.image_path);
      }

      const optimized = await ImageHelper.product(file);

      const upload = await SupabaseService.upload(optimized, "products");

      payload.image_url = upload.public_url;
      payload.image_path = upload.path;
    }

    return ProductRepository.update(id, payload);
  }

  async delete(id) {
    const product = await ProductRepository.findById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.image_path) {
      await SupabaseService.remove(product.image_path);
    }

    await ProductRepository.delete(id);

    return true;
  }
}

module.exports = new ProductService();
