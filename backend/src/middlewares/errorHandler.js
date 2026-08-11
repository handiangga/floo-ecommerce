const ResponseHelper = require("../helpers/response.helper");

module.exports = (err, req, res, next) => {
  console.error({
    message: err.message,
    name: err.name,
    path: req.originalUrl,
    method: req.method,
  });

  if (err.name === "MulterError") {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Ukuran gambar terlalu besar. Maksimal 10 MB."
        : "Upload gambar tidak valid. Gunakan JPG, PNG, atau WEBP.";
    return ResponseHelper.validation(res, [
      {
        field: err.field || "image",
        message,
      },
    ], message);
  }

  if (err.name === "SequelizeValidationError") {
    return ResponseHelper.validation(
      res,
      err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    );
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    const isProduct = req.originalUrl.startsWith("/api/v1/products");
    return ResponseHelper.conflict(
      res,
      isProduct
        ? "Produk dengan nama atau slug tersebut sudah ada. Gunakan nama produk yang berbeda."
        : err.errors[0]?.message || "Data yang sama sudah ada.",
    );
  }

  if (err.message === "Product already exists") {
    return ResponseHelper.conflict(
      res,
      "Produk dengan nama atau slug tersebut sudah ada. Gunakan nama produk yang berbeda.",
    );
  }

  const message =
    process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message || "Internal Server Error";

  return ResponseHelper.error(res, message);
};
