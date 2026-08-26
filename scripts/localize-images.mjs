import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const PUBLIC_DIR = path.join(ROOT, "public");

const REMOTE_HOSTS = new Set([
  "pub-32868b48992b43ebae1d6e46b84716f6.r2.dev",
  "r2-eoffice-docs.zire.dev",
]);

const URL_RE =
  /https:\/\/(?:pub-32868b48992b43ebae1d6e46b84716f6\.r2\.dev|r2-eoffice-docs\.zire\.dev)\/[^\s)\]`"']+/g;

async function walk(dir, out = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (/\.mdx?$/i.test(entry.name)) out.push(full);
  }
  return out;
}

function normalizeUrl(raw) {
  return raw.replace(/[.,;:!?]+$/g, "");
}

function toLocalPath(url) {
  const u = new URL(url);
  // Keep object key under /media/... so public URLs are /media/uploads/...
  const key = u.pathname.replace(/^\/+/, "");
  return {
    diskPath: path.join(PUBLIC_DIR, "media", key),
    publicUrl: `/media/${key}`,
  };
}

async function download(url, diskPath) {
  await fs.mkdir(path.dirname(diskPath), { recursive: true });
  try {
    await fs.access(diskPath);
    return "exists";
  } catch {
    // continue
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(diskPath, buf);
  return "downloaded";
}

async function main() {
  const files = await walk(CONTENT_DIR);
  const urlMap = new Map(); // remote -> publicUrl
  const occurrences = [];

  for (const file of files) {
    const text = await fs.readFile(file, "utf8");
    const matches = text.match(URL_RE) ?? [];
    for (const raw of matches) {
      const url = normalizeUrl(raw);
      try {
        const host = new URL(url).hostname;
        if (!REMOTE_HOSTS.has(host)) continue;
      } catch {
        continue;
      }
      if (!urlMap.has(url)) {
        const local = toLocalPath(url);
        urlMap.set(url, local);
      }
      occurrences.push({ file, url });
    }
  }

  console.log(`Found ${urlMap.size} unique remote image URLs in ${files.length} files`);

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;
  const failures = [];

  const entries = [...urlMap.entries()];
  const concurrency = 8;
  let i = 0;

  async function worker() {
    while (i < entries.length) {
      const idx = i++;
      const [url, local] = entries[idx];
      try {
        const status = await download(url, local.diskPath);
        if (status === "downloaded") downloaded++;
        else skipped++;
        if ((downloaded + skipped) % 25 === 0) {
          console.log(`Progress: ${downloaded + skipped}/${entries.length}`);
        }
      } catch (err) {
        failed++;
        failures.push({ url, error: String(err) });
        console.error(`FAIL ${url}: ${err}`);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  // Rewrite MDX files
  let rewrittenFiles = 0;
  for (const file of files) {
    let text = await fs.readFile(file, "utf8");
    let changed = false;
    for (const [url, local] of urlMap) {
      if (text.includes(url)) {
        text = text.split(url).join(local.publicUrl);
        changed = true;
      }
    }
    if (changed) {
      await fs.writeFile(file, text, "utf8");
      rewrittenFiles++;
    }
  }

  console.log("\nDone");
  console.log(`  downloaded: ${downloaded}`);
  console.log(`  already on disk: ${skipped}`);
  console.log(`  failed: ${failed}`);
  console.log(`  files rewritten: ${rewrittenFiles}`);
  if (failures.length) {
    console.log("\nFailures:");
    for (const f of failures) console.log(`  - ${f.url}\n    ${f.error}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
