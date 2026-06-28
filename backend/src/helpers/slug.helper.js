const slugify = require("slugify");

class SlugHelper {
  static generate(text) {
    return slugify(text, {
      lower: true,
      strict: true,
      trim: true,
    });
  }
}

module.exports = SlugHelper;
