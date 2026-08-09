"use strict";

const API_BASE = "https://www.emsifa.com/api-wilayah-indonesia/api";
const CACHE_TTL = 24 * 60 * 60 * 1000;
const cache = new Map();

class RegionService {
  async provinces() {
    return this.fetchList("provinces");
  }
  async regencies(provinceCode) {
    return this.fetchList(`regencies/${this.validCode(provinceCode)}`);
  }
  async districts(regencyCode) {
    return this.fetchList(`districts/${this.validCode(regencyCode)}`);
  }
  async villages(districtCode) {
    return this.fetchList(`villages/${this.validCode(districtCode)}`);
  }

  validCode(code) {
    const value = String(code || "");
    if (!/^\d{2,13}$/.test(value)) throw new Error("Invalid region code");
    return value;
  }

  async fetchList(path) {
    const cacheKey = path;
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return cached.data;

    const response = await fetch(`${API_BASE}/${path}.json`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok)
      throw new Error("Indonesian region data is temporarily unavailable");
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Invalid Indonesian region data");
    const normalized = data.map((item) => ({
      code: String(item.code || item.id),
      name: String(item.name),
    }));
    cache.set(cacheKey, {
      data: normalized,
      expiresAt: Date.now() + CACHE_TTL,
    });
    return normalized;
  }
}

module.exports = new RegionService();
