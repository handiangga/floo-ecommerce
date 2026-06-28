class DateUtil {
  static now() {
    return new Date();
  }

  static format(date = new Date()) {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  }

  static formatDate(date = new Date()) {
    return new Intl.DateTimeFormat("id-ID").format(new Date(date));
  }

  static addDays(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }
}

module.exports = DateUtil;
