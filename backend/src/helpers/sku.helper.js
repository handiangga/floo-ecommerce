class SKUHelper {
  static generate(category, productId, color, size) {
    const cat = category.substring(0, 3).toUpperCase();
    const clr = color.substring(0, 3).toUpperCase();
    const sz = size.toUpperCase();

    return `${cat}-${productId}-${clr}-${sz}`;
  }
}

module.exports = SKUHelper;
