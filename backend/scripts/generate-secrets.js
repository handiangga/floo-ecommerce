"use strict";

const crypto = require("crypto");

const createSecret = () => crypto.randomBytes(48).toString("base64url");

console.log("JWT_SECRET=" + createSecret());
console.log("CRON_SECRET=" + createSecret());
console.log("INITIAL_OWNER_PASSWORD=" + createSecret());
