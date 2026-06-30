const slugify = require("slugify");

class SlugHelper {
  /**
   * Generate slug
   */
  static generate(text = "") {
    return slugify(text, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  /**
   * Generate unique slug
   * Example:
   * kebaya
   * kebaya-2
   * kebaya-3
   */
  static unique(text = "", count = 0) {
    const slug = this.generate(text);

    return count > 0 ? `${slug}-${count + 1}` : slug;
  }
}

module.exports = SlugHelper;
