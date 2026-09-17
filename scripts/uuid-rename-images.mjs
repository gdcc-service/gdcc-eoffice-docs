import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const MEDIA_DIR = path.join(ROOT, "public", "media");

const MEDIA_URL_RE = /\/media\/[^\s)\]`"']+/g;
const IMAGE_EXT_RE = /\.(png|jpe?g|webp|gif|svg)$/i;

async function walk(dir, out = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (/\.mdx?$/i.test(entry.name)) out.push(full);
  }
  return out;
}

async function walkFiles(dir, out = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walkFiles(full, out);
    else out.push(full);
  }
  return out;
}

function normalizeUrl(raw) {
  return raw.replace(/[.,;:!?]+$/g, "");
}

function extOf(filePathOrUrl) {
  const ext = path.extname(filePathOrUrl).toLowerCase();
  return IMAGE_EXT_RE.test(ext) ? ext : ".png";
}

async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function removeEmptyDirs(dir) {
  if (!(await pathExists(dir))) return;
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      await removeEmptyDirs(path.join(dir, entry.name));
    }
  }
  const remaining = await fs.readdir(dir);
  if (remaining.length === 0 && path.resolve(dir) !== path.resolve(MEDIA_DIR)) {
    await fs.rmdir(dir);
  }
}

async function main() {
  await fs.mkdir(MEDIA_DIR, { recursive: true });

  const mdxFiles = await walk(CONTENT_DIR);
  const oldToNew = new Map(); // old public url -> new public url
  const usedOldUrls = new Set();

  for (const file of mdxFiles) {
    const text = await fs.readFile(file, "utf8");
    const matches = text.match(MEDIA_URL_RE) ?? [];
    for (const raw of matches) {
      const url = normalizeUrl(raw);
      if (!url.startsWith("/media/")) continue;
      usedOldUrls.add(url);
    }
  }

  console.log(`Found ${usedOldUrls.size} unique /media/ references`);

  let renamed = 0;
  let missing = 0;

  for (const oldUrl of usedOldUrls) {
    const rel = oldUrl.replace(/^\/media\//, "");
    const oldDisk = path.join(MEDIA_DIR, rel);
    const ext = extOf(oldUrl);
    const uuid = crypto.randomUUID();
    const newName = `${uuid}${ext}`;
    const newUrl = `/media/${newName}`;
    const newDisk = path.join(MEDIA_DIR, newName);

    if (!(await pathExists(oldDisk))) {
      console.warn(`MISSING: ${oldUrl}`);
      missing++;
      continue;
    }

    // If already flat uuid-named, keep mapping identity unless nested
    const base = path.basename(oldDisk);
    const alreadyUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.[a-z0-9]+$/i.test(
      base,
    );
    const isFlat = path.dirname(oldDisk) === MEDIA_DIR;

    if (alreadyUuid && isFlat) {
      oldToNew.set(oldUrl, oldUrl);
      continue;
    }

    await fs.rename(oldDisk, newDisk);
    oldToNew.set(oldUrl, newUrl);
    renamed++;
  }

  let rewrittenFiles = 0;
  for (const file of mdxFiles) {
    let text = await fs.readFile(file, "utf8");
    let changed = false;
    // Replace longer URLs first to avoid partial collisions
    const keys = [...oldToNew.keys()].sort((a, b) => b.length - a.length);
    for (const oldUrl of keys) {
      const newUrl = oldToNew.get(oldUrl);
      if (oldUrl === newUrl) continue;
      if (text.includes(oldUrl)) {
        text = text.split(oldUrl).join(newUrl);
        changed = true;
      }
    }
    if (changed) {
      await fs.writeFile(file, text, "utf8");
      rewrittenFiles++;
    }
  }

  // Remove leftover nested files/dirs under public/media
  const allFiles = await walkFiles(MEDIA_DIR);
  let orphanDeleted = 0;
  for (const file of allFiles) {
    if (path.dirname(file) === MEDIA_DIR) continue;
    await fs.unlink(file);
    orphanDeleted++;
  }
  await removeEmptyDirs(MEDIA_DIR);

  const keptFlat = oldToNew.size - renamed;

  console.log("\nDone");
  console.log(`  renamed: ${renamed}`);
  console.log(`  already uuid+flat: ${keptFlat}`);
  console.log(`  missing source files: ${missing}`);
  console.log(`  files rewritten: ${rewrittenFiles}`);
  console.log(`  nested leftovers deleted: ${orphanDeleted}`);

  if (missing > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
