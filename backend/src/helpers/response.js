exports.success = (
  res,
  data = null,
  message = "Success",
  status = 200,
  meta = null,
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    meta,
  });
};

exports.error = (res, message = "Error", status = 500, errors = null) => {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
};
