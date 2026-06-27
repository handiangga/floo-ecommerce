const { error } = require("../helpers/response");

module.exports = (err, req, res, next) => {
  console.error(err);

  return error(res, err.message || "Internal Server Error", err.status || 500);
};
