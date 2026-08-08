"use strict";

const path = require("path");
const crypto = require("crypto");

const supabase = require("../config/supabase");

const DEFAULT_BUCKET = process.env.SUPABASE_BUCKET;

class SupabaseService {
  generateFileName(originalName) {
    const ext = path.extname(originalName).toLowerCase();

    return `${Date.now()}-${crypto.randomUUID()}${ext}`;
  }

  getPublicUrl(bucket, filePath) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return data.publicUrl;
  }

  async upload(file, folder = "") {
    if (!file) {
      throw new Error("File is required");
    }

    const bucket = DEFAULT_BUCKET;
    if (!bucket) {
      throw new Error("SUPABASE_BUCKET is required");
    }

    const fileName = this.generateFileName(file.originalname);

    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    return {
      bucket,
      path: filePath,
      file_name: fileName,
      public_url: this.getPublicUrl(bucket, filePath),
    };
  }

  async remove(filePath, bucket = DEFAULT_BUCKET) {
    if (!filePath) return true;
    if (!bucket) {
      throw new Error("SUPABASE_BUCKET is required");
    }

    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
      throw error;
    }

    return true;
  }

  async replace(oldPath, file, folder = "") {
    if (oldPath) {
      await this.remove(oldPath);
    }

    return this.upload(file, folder);
  }
}

module.exports = new SupabaseService();
