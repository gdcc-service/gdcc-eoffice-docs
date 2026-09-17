import path from "node:path";
import { fileURLToPath } from "node:url";
import { getTableOfContents } from "fumadocs-core/content/toc";
import { getSlugs } from "fumadocs-core/source";
import { printErrors, readFiles, validateFiles } from "next-validate-link";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOCS_DIR = path.join(ROOT, "content", "docs");

function posixRelative(from, to) {
  return path.relative(from, to).split(path.sep).join("/");
}

function fileToSlugs(file) {
  return getSlugs(posixRelative(DOCS_DIR, file));
}

function fileToUrl(file) {
  const slugs = fileToSlugs(file);
  return slugs.length === 0 ? "/docs" : `/docs/${slugs.join("/")}`;
}

function hashesFromContent(content) {
  return getTableOfContents(content).map((item) => item.url.slice(1));
}

/**
 * Build the URL map from content files.
 * Avoids next-validate-link scanURLs on Windows, where glob returns
 * `docs/[[...slug]]` with forward slashes and path.sep splits wrong.
 */
function scanFromDocsFiles(docsFiles) {
  const urls = new Map([["/", {}]]);

  for (const file of docsFiles) {
    const url = fileToUrl(file.path);
    const existing = urls.get(url) ?? { hashes: [] };
    const hashes = new Set([...(existing.hashes ?? []), ...hashesFromContent(file.content)]);
    urls.set(url, { hashes: [...hashes] });
  }

  return { urls, fallbackUrls: [] };
}

async function checkLinks() {
  const docsFiles = await readFiles("content/docs/**/*.{md,mdx}", {
    pathToUrl: fileToUrl,
  });

  const scanned = scanFromDocsFiles(docsFiles);

  printErrors(
    await validateFiles(docsFiles, {
      scanned,
      checkRelativePaths: "as-url",
      markdown: {
        components: {
          Card: { attributes: ["href"] },
        },
      },
    }),
    true,
  );
}

await checkLinks();
