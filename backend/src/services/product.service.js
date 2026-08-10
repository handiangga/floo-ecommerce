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
      subcategory_id: query.subcategory_id,
      collection_slug: query.collection_slug,
      status: query.status,

      is_featured:
        query.is_featured !== undefined
          ? query.is_featured === "true"
          : undefined,

      is_best_seller:
        query.is_best_seller !== undefined
          ? query.is_best_seller === "true"
          : undefined,

      is_new_arrival:
        query.is_new_arrival !== undefined
          ? query.is_new_arrival === "true"
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
    await this.validateClassification(payload);
    const collectionIds = this.parseCollectionIds(payload.collection_ids);
    delete payload.collection_ids;

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

    const product = await ProductRepository.create(payload);
    if (collectionIds.length) await product.setCollections(collectionIds);
    return ProductRepository.findById(product.id);
  }

  async update(id, payload, file) {
    const product = await ProductRepository.findById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    await this.validateClassification({ ...product.toJSON(), ...payload });
    const hasCollections = Object.prototype.hasOwnProperty.call(payload, "collection_ids");
    const collectionIds = this.parseCollectionIds(payload.collection_ids);
    delete payload.collection_ids;

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

    const updated = await ProductRepository.update(id, payload);
    if (hasCollections) await updated.setCollections(collectionIds);
    return ProductRepository.findById(id);
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

  parseCollectionIds(value) {
    if (!value) return [];
    const parsed = Array.isArray(value) ? value : JSON.parse(value);
    return [...new Set(parsed.map(Number).filter(Number.isInteger))];
  }

  async validateClassification(payload) {
    const category = await CategoryRepository.findById(payload.category_id);
    if (!category || category.parent_id) throw new Error("Kategori utama tidak valid");
    if (payload.subcategory_id) {
      const subcategory = await CategoryRepository.findById(payload.subcategory_id);
      if (!subcategory || Number(subcategory.parent_id) !== Number(category.id)) throw new Error("Subkategori harus berasal dari kategori utama yang dipilih");
    }
  }
}

module.exports = new ProductService();
