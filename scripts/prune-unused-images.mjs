import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const MEDIA_DIR = path.join(ROOT, "public", "media");

const MEDIA_URL_RE = /\/media\/[^\s)\]`"']+/g;
const IMAGE_EXT_RE = /\.(png|jpe?g|webp|gif|svg)$/i;

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run") || args.has("-n");
const apply = args.has("--delete") || args.has("--apply");

async function walkMdx(dir, out = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walkMdx(full, out);
    else if (/\.mdx?$/i.test(entry.name)) out.push(full);
  }
  return out;
}

async function listMediaFiles() {
  let entries;
  try {
    entries = await fs.readdir(MEDIA_DIR, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = [];
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!IMAGE_EXT_RE.test(entry.name)) continue;
    files.push(entry.name);
  }
  return files;
}

function normalizeUrl(raw) {
  return raw.replace(/[.,;:!?]+$/g, "");
}

async function main() {
  if (!dryRun && !apply) {
    console.log(
      "Usage:\n  node scripts/prune-unused-images.mjs --dry-run   # list unused\n  node scripts/prune-unused-images.mjs --delete    # delete unused\n",
    );
    process.exitCode = 1;
    return;
  }

  const mdxFiles = await walkMdx(CONTENT_DIR);
  const usedNames = new Set();

  for (const file of mdxFiles) {
    const text = await fs.readFile(file, "utf8");
    const matches = text.match(MEDIA_URL_RE) ?? [];
    for (const raw of matches) {
      const url = normalizeUrl(raw);
      if (!url.startsWith("/media/")) continue;
      const name = path.posix.basename(url);
      usedNames.add(name);
    }
  }

  const mediaFiles = await listMediaFiles();
  const unused = mediaFiles.filter((name) => !usedNames.has(name));
  const used = mediaFiles.length - unused.length;

  console.log(`Media folder: ${MEDIA_DIR}`);
  console.log(`Total images: ${mediaFiles.length}`);
  console.log(`Referenced:  ${used}`);
  console.log(`Unused:      ${unused.length}`);

  if (unused.length === 0) {
    console.log("\nNothing to delete.");
    return;
  }

  if (dryRun) {
    console.log("\nUnused files (dry-run, not deleted):");
    for (const name of unused.sort()) {
      console.log(`  ${name}`);
    }
    return;
  }

  for (const name of unused) {
    await fs.unlink(path.join(MEDIA_DIR, name));
  }
  console.log(`\nDeleted ${unused.length} unused image(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
