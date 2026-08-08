"use strict";

const ResponseHelper = require("../helpers/response.helper");

const stores = new Map();

function getClientKey(req) {
  return req.ip || req.socket?.remoteAddress || "unknown";
}

function prune(now) {
  for (const [key, entry] of stores) {
    if (entry.resetAt <= now) stores.delete(key);
  }
}

setInterval(() => prune(Date.now()), 15 * 60 * 1000).unref();

function rateLimit({
  windowMs = 15 * 60 * 1000,
  max = 100,
  message = "Too many requests. Please try again later.",
  keyPrefix = "global",
} = {}) {
  return (req, res, next) => {
    const now = Date.now();
    const key = keyPrefix + ":" + getClientKey(req);
    const current = stores.get(key);

    if (!current || current.resetAt <= now) {
      stores.set(key, { count: 1, resetAt: now + windowMs });
      res.setHeader("RateLimit-Limit", String(max));
      res.setHeader("RateLimit-Remaining", String(Math.max(0, max - 1)));
      return next();
    }

    current.count += 1;
    res.setHeader("RateLimit-Limit", String(max));
    res.setHeader("RateLimit-Remaining", String(Math.max(0, max - current.count)));

    if (current.count > max) {
      const retryAfter = Math.ceil((current.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(retryAfter));
      return ResponseHelper.tooManyRequests(res, message);
    }

    return next();
  };
}

module.exports = rateLimit;
