"use strict";

const multer = require("multer");
const sharp = require("sharp");

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const storage = multer.memoryStorage();

const validateImageFiles = async (req, res, next) => {
  const files = req.files
    ? Array.isArray(req.files)
      ? req.files
      : Object.values(req.files).flat()
    : req.file
      ? [req.file]
      : [];

  try {
    await Promise.all(
      files.map(async (file) => {
        const metadata = await sharp(file.buffer, {
          limitInputPixels: 40_000_000,
        }).metadata();

        if (!["jpeg", "png", "webp"].includes(metadata.format)) {
          throw new Error("Only JPG, PNG, and WEBP image files are allowed");
        }
      }),
    );

    return next();
  } catch (error) {
    return res.status(422).json({
      success: false,
      message: "Invalid image file",
      errors: null,
    });
  }
};

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new Error("Only JPG, JPEG, PNG, and WEBP image files are allowed"),
      false,
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});

module.exports = {
  single: (field = "image") => [upload.single(field), validateImageFiles],

  array: (field = "images", maxCount = 10) => [
    upload.array(field, maxCount),
    validateImageFiles,
  ],

  fields: (fields = []) => [upload.fields(fields), validateImageFiles],
};
