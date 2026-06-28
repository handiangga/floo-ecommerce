class ResponseHelper {
  /**
   * Success Response
   */
  static success(res, data = null, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Success Response + Pagination
   */
  static pagination(res, data, meta, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta,
    });
  }

  /**
   * Error Response
   */
  static error(
    res,
    message = "Internal Server Error",
    statusCode = 500,
    errors = null,
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  /**
   * Created Response
   */
  static created(res, data, message = "Created Successfully") {
    return this.success(res, data, message, 201);
  }

  /**
   * Updated Response
   */
  static updated(res, data = null, message = "Updated Successfully") {
    return this.success(res, data, message, 200);
  }

  /**
   * Deleted Response
   */
  static deleted(res, message = "Deleted Successfully") {
    return this.success(res, null, message, 200);
  }

  /**
   * No Content Response
   */
  static noContent(res) {
    return res.status(204).send();
  }

  /**
   * Validation Error
   */
  static validation(res, errors, message = "Validation Error") {
    return this.error(res, message, 422, errors);
  }

  /**
   * Unauthorized
   */
  static unauthorized(res, message = "Unauthorized") {
    return this.error(res, message, 401);
  }

  /**
   * Forbidden
   */
  static forbidden(res, message = "Forbidden") {
    return this.error(res, message, 403);
  }

  /**
   * Not Found
   */
  static notFound(res, message = "Data Not Found") {
    return this.error(res, message, 404);
  }

  /**
   * Conflict
   */
  static conflict(res, message = "Conflict") {
    return this.error(res, message, 409);
  }
}

module.exports = ResponseHelper;
