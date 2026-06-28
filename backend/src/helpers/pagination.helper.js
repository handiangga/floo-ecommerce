class PaginationHelper {
  static getPagination(query) {
    const page = Math.max(parseInt(query.page) || 1, 1);
    const limit = Math.max(parseInt(query.limit) || 10, 1);

    return {
      page,
      limit,
      offset: (page - 1) * limit,
    };
  }

  static getMeta(total, page, limit) {
    return {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
      has_prev: page > 1,
      has_next: page < Math.ceil(total / limit),
    };
  }
}

module.exports = PaginationHelper;
