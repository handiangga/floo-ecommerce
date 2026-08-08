"use strict";

const crypto = require("crypto");
const ResponseHelper = require("../helpers/response.helper");

module.exports = (req, res, next) => {
  const expected = process.env.CRON_SECRET;
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");

  if (!expected || !token) {
    return ResponseHelper.unauthorized(res, "Cron authorization required");
  }

  const expectedBuffer = Buffer.from(expected);
  const tokenBuffer = Buffer.from(token);

  if (
    expectedBuffer.length !== tokenBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, tokenBuffer)
  ) {
    return ResponseHelper.unauthorized(res, "Invalid cron authorization");
  }

  return next();
};
