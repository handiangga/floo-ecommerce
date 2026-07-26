"use strict";

const sharp = require("sharp");

class ImageHelper {
  async optimize(file, options = {}) {
    if (!file) {
      throw new Error("File is required");
    }

    const { width = 1200, height = null, quality = 85 } = options;

    const buffer = await sharp(file.buffer)
      .rotate()
      .resize({
        width,
        height,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality,
      })
      .toBuffer();

    return {
      ...file,
      buffer,
      size: buffer.length,
      mimetype: "image/webp",
      originalname: file.originalname.replace(/\.[^.]+$/, "") + ".webp",
    };
  }

  async thumbnail(file) {
    return this.optimize(file, {
      width: 400,
      quality: 80,
    });
  }

  async product(file) {
    return this.optimize(file, {
      width: 1200,
      quality: 85,
    });
  }

  async banner(file) {
    return this.optimize(file, {
      width: 1920,
      quality: 90,
    });
  }

  async avatar(file) {
    return this.optimize(file, {
      width: 500,
      quality: 85,
    });
  }
}

module.exports = new ImageHelper();
