const { Product, Category, Collection, ProductImage, ProductVariant, Color, Size } = require("../../models");
const { Op } = require("sequelize");

const productIncludes = (collection_slug) => {
  const collections = { model: Collection, as: "collections", through: { attributes: [] }, required: Boolean(collection_slug) };
  if (collection_slug) collections.where = { slug: collection_slug, status: "ACTIVE" };
  return [
    { model: Category, as: "category" },
    { model: Category, as: "subcategory", required: false },
    collections,
    { model: ProductImage, as: "images", required: false, separate: true, order: [["sort_order", "ASC"]] },
    { model: ProductVariant, as: "variants", required: false, include: [{ model: Color, as: "color" }, { model: Size, as: "size" }] },
  ];
};

class ProductRepository {
  async findAll({ limit, offset, search = "", category_id, subcategory_id, collection_slug, status, is_featured, is_best_seller, is_new_arrival, sort = "createdAt", order = "DESC" }) {
    const where = {};
    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (category_id) where.category_id = category_id;
    if (subcategory_id) where.subcategory_id = subcategory_id;
    if (status) where.status = status;
    if (is_best_seller !== undefined) where.is_best_seller = is_best_seller;
    if (is_new_arrival !== undefined) where.is_new_arrival = is_new_arrival;
    if (is_featured !== undefined) where.is_featured = is_featured;
    return Product.findAndCountAll({ where, include: productIncludes(collection_slug), distinct: true, limit, offset, order: [[sort, order]] });
  }
  findById(id) { return Product.findByPk(id, { include: productIncludes() }); }
  findBySlug(slug) { return Product.findOne({ where: { slug }, include: productIncludes() }); }
  create(payload) { return Product.create(payload); }
  async update(id, payload) { await Product.update(payload, { where: { id } }); return this.findById(id); }
  delete(id) { return Product.destroy({ where: { id } }); }
}
module.exports = new ProductRepository();
