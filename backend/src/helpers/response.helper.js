class ResponseHelper {
  /**
   * Success
   */
  static success(res, data = null, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Success + Pagination
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
   * Error
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
   * Created
   */
  static created(res, data, message = "Created successfully") {
    return this.success(res, data, message, 201);
  }

  /**
   * Updated
   */
  static updated(res, data, message = "Updated successfully") {
    return this.success(res, data, message);
  }

  /**
   * Deleted
   */
  static deleted(res, message = "Deleted successfully") {
    return this.success(res, null, message);
  }

  /**
   * Validation Error
   */
  static validation(res, errors, message = "Validation error") {
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
  static notFound(res, message = "Data not found") {
    return this.error(res, message, 404);
  }

  /**
   * Conflict
   */
  static conflict(res, message = "Conflict") {
    return this.error(res, message, 409);
  }

  /**
   * Bad Request
   */
  static badRequest(res, message = "Bad request", errors = null) {
    return this.error(res, message, 400, errors);
  }

  /**
   * Too Many Requests
   */
  static tooManyRequests(res, message = "Too many requests") {
    return this.error(res, message, 429);
  }
}

module.exports = ResponseHelper;
