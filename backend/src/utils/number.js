class NumberUtil {
  static toRupiah(number = 0) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  }

  static random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

module.exports = NumberUtil;
