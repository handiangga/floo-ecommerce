"use strict";

const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");

const uploadsDirectory = path.resolve(process.env.UPLOADS_DIR || path.join(process.cwd(), "uploads"));
const publicUploadsUrl = (process.env.PUBLIC_UPLOAD_URL || "http://localhost:5000/uploads").replace(/\/$/, "");

class LocalStorageService {
  generateFileName(originalName) {
    const extension = path.extname(originalName || "").toLowerCase();
    return `${Date.now()}-${crypto.randomUUID()}${extension}`;
  }

  getPublicUrl(filePath) {
    return `${publicUploadsUrl}/${filePath.split(path.sep).map(encodeURIComponent).join("/")}`;
  }

  getPathFromPublicUrl(publicUrl) {
    if (!publicUrl) return null;
    try {
      const url = new URL(publicUrl);
      const prefix = new URL(`${publicUploadsUrl}/`).pathname;
      if (!url.pathname.startsWith(prefix)) return null;
      return decodeURIComponent(url.pathname.slice(prefix.length)).replace(/^\/+/, "");
    } catch {
      return null;
    }
  }

  resolveFile(filePath) {
    const normalized = path.posix.normalize(String(filePath || "").replace(/\\/g, "/")).replace(/^\/+/, "");
    const destination = path.resolve(uploadsDirectory, normalized);
    if (!normalized || !destination.startsWith(`${uploadsDirectory}${path.sep}`)) {
      throw new Error("Invalid upload path");
    }
    return { normalized, destination };
  }

  async upload(file, folder = "") {
    if (!file?.buffer) throw new Error("File is required");
    const fileName = this.generateFileName(file.originalname);
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    const { normalized, destination } = this.resolveFile(filePath);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.writeFile(destination, file.buffer, { flag: "wx" });
    return { path: normalized, file_name: fileName, public_url: this.getPublicUrl(normalized) };
  }

  async remove(filePath) {
    if (!filePath) return true;
    try {
      const { destination } = this.resolveFile(filePath);
      await fs.unlink(destination);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    return true;
  }

  async removeByPublicUrl(publicUrl) {
    const filePath = this.getPathFromPublicUrl(publicUrl);
    if (!filePath) return false;
    await this.remove(filePath);
    return true;
  }
}

module.exports = new LocalStorageService();
module.exports.uploadsDirectory = uploadsDirectory;
