class SKUHelper {
  /**
   * Generate SKU
   * Example:
   * KEB-000001-BLA-M
   */
  static generate(category, productId, color, size) {
    const cat = (category || "PRD").substring(0, 3).toUpperCase();

    const clr = (color || "DEF").substring(0, 3).toUpperCase();

    const sz = (size || "STD").toUpperCase();

    const id = String(productId).padStart(6, "0");

    return `${cat}-${id}-${clr}-${sz}`;
  }

  /**
   * Generate Product SKU
   * Example:
   * FL-000001
   */
  static product(productId) {
    return `FL-${String(productId).padStart(6, "0")}`;
  }

  /**
   * Generate Variant SKU
   * Example:
   * FL-000001-BLK-L
   */
  static variant(productId, color, size) {
    const clr = (color || "DEF").substring(0, 3).toUpperCase();

    const sz = (size || "STD").toUpperCase();

    return `FL-${String(productId).padStart(6, "0")}-${clr}-${sz}`;
  }
}

module.exports = SKUHelper;
