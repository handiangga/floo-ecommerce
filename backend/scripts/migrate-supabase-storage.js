"use strict";

/*
 * Manual migration utility. It is intentionally dry-run by default.
 * --copy  downloads objects to local storage but does not change database rows.
 * --apply downloads objects and updates only rows whose copies succeeded.
 */
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");
const StorageService = require("../src/services/local-storage.service");
const models = require("../models");

const mode = process.argv.includes("--apply") ? "apply" : process.argv.includes("--copy") ? "copy" : "dry-run";
const bucket = process.env.SUPABASE_BUCKET;
const sourceUrl = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const targets = [
  ["Product", "image_url", "image_path"],
  ["ProductImage", "image"],
  ["ProductVariant", "image"],
  ["Banner", "image"],
  ["HomepageOccasion", "image"],
  ["HomepageCraftsmanship", "image"],
  ["Category", "image"],
  ["Color", "image"],
  ["ReviewImage", "image"],
  ["Payment", "proof_url", "proof_path"],
];

function sourcePath(url) {
  if (!url || !sourceUrl || !bucket || !url.startsWith(sourceUrl)) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  try {
    const pathname = new URL(url).pathname;
    const index = pathname.indexOf(marker);
    return index < 0 ? null : decodeURIComponent(pathname.slice(index + marker.length));
  } catch {
    return null;
  }
}

async function main() {
  if (!sourceUrl || !process.env.SUPABASE_SERVICE_ROLE_KEY || !bucket) {
    throw new Error("SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_BUCKET are required for this manual migration script");
  }
  const supabase = createClient(sourceUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const summary = { mode, found: 0, copied: 0, updated: 0, failed: 0 };

  for (const [modelName, urlField, pathField] of targets) {
    const Model = models[modelName];
    if (!Model) continue;
    const rows = await Model.findAll({ attributes: ["id", urlField] });
    for (const row of rows) {
      const path = sourcePath(row[urlField]);
      if (!path) continue;
      summary.found += 1;
      if (mode === "dry-run") {
        console.log(`[would migrate] ${modelName}#${row.id} ${path}`);
        continue;
      }
      try {
        const { data, error } = await supabase.storage.from(bucket).download(path);
        if (error) throw error;
        const buffer = Buffer.from(await data.arrayBuffer());
        const upload = await StorageService.upload({ originalname: path, buffer }, path.split("/").slice(0, -1).join("/"));
        summary.copied += 1;
        if (mode === "apply") {
          const patch = { [urlField]: upload.public_url };
          if (pathField) patch[pathField] = upload.path;
          await Model.update(patch, { where: { id: row.id } });
          summary.updated += 1;
        }
      } catch (error) {
        summary.failed += 1;
        console.error(`[failed] ${modelName}#${row.id} ${path}: ${error.message}`);
      }
    }
  }
  console.log(JSON.stringify(summary));
  if (summary.failed) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}).finally(() => models.sequelize.close());
