class PaginationHelper {
  static getPagination(query) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.max(Number(query.limit) || 10, 1);

    return {
      page,
      limit,
      offset: (page - 1) * limit,
    };
  }

  static getMeta(total, page, limit) {
    const total_pages = Math.max(1, Math.ceil(total / limit));

    return {
      page,
      limit,
      total,
      total_pages,
      has_prev: page > 1,
      has_next: page < total_pages,
    };
  }
}

module.exports = PaginationHelper;
