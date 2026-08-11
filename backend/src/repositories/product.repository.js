const { Product, Category, Collection, ProductImage, ProductVariant, Color, Size, OrderItem, Order } = require("../../models");
const { Op, fn, col, literal } = require("sequelize");
const ORDER_STATUS = require("../constants/orderStatus");

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
  async findAll({ limit, offset, search = "", category_id, subcategory_id, collection_slug, status, is_featured, is_best_seller, is_new_arrival, product_ids, sort = "createdAt", order = "DESC" }) {
    const where = {};
    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (category_id) where.category_id = category_id;
    if (subcategory_id) where.subcategory_id = subcategory_id;
    if (status) where.status = status;
    if (product_ids) where.id = product_ids.length ? { [Op.in]: product_ids } : { [Op.in]: [-1] };
    // New Arrival is determined by the upload date; default ordering is newest first.
    // `is_new_arrival` is intentionally not stored as a manually controlled flag.
    if (is_featured !== undefined) where.is_featured = is_featured;
    const productOrder = product_ids?.length
      ? [[literal(`array_position(ARRAY[${product_ids.map(Number).join(",")}]::bigint[], "Product"."id")`), "ASC"]]
      : [[sort, order]];
    return Product.findAndCountAll({ where, include: productIncludes(collection_slug), distinct: true, limit, offset, order: productOrder });
  }
  async findBestSellerProductIds() {
    const rows = await OrderItem.findAll({
      attributes: [[col("variant.product_id"), "product_id"], [fn("SUM", col("OrderItem.qty")), "sold_count"]],
      include: [
        { model: ProductVariant, as: "variant", attributes: [], required: true },
        { model: Order, as: "order", attributes: [], required: true, where: { status: ORDER_STATUS.COMPLETED } },
      ],
      group: ["variant.product_id"],
      order: [[literal('"sold_count"'), "DESC"]],
      raw: true,
    });
    return rows.map((row) => Number(row.product_id)).filter(Number.isInteger);
  }
  findById(id) { return Product.findByPk(id, { include: productIncludes() }); }
  findBySlug(slug) { return Product.findOne({ where: { slug }, include: productIncludes() }); }
  create(payload) { return Product.create(payload); }
  async update(id, payload) { await Product.update(payload, { where: { id } }); return this.findById(id); }
  delete(id) { return Product.destroy({ where: { id } }); }
}
module.exports = new ProductRepository();
