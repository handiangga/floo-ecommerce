class StringUtil {
  static capitalize(text = "") {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  static upper(text = "") {
    return text.toUpperCase();
  }

  static lower(text = "") {
    return text.toLowerCase();
  }

  static trim(text = "") {
    return text.trim();
  }
}

module.exports = StringUtil;
