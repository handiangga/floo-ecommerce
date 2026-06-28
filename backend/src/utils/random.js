const crypto = require("crypto");

class RandomUtil {
  static number(length = 6) {
    let result = "";

    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10);
    }

    return result;
  }

  static string(length = 20) {
    return crypto.randomBytes(length).toString("hex").slice(0, length);
  }

  static uuid() {
    return crypto.randomUUID();
  }
}

module.exports = RandomUtil;
