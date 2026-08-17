import { defineDocs } from "fumadocs-mdx/macro";
import { type InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { docsContentRoute, docsImageRoute, docsRoute } from "./shared";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleQuestion,
  faToggleOn,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons";
// import { defineConfig } from "fumadocs-mdx/config";
import { editorPlugin } from "fumadocs-editor/plugin";
// import lastModified from "fumadocs-mdx/plugins/last-modified";
import { getEOfficeMenu, adminIcon, userIcon } from "@/config";

const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

// export default defineConfig({
//   mdxOptions: {
//     // MDX options
//   },
//   plugins: [lastModified()],
// });

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  plugins: [
    // lucideIconsPlugin(),
    editorPlugin(),
  ],
  icon(icon) {
    if (!icon) return undefined;
    switch (icon) {
      case "quickstart": {
        return <FontAwesomeIcon icon={faCircleQuestion} />;
      }

      case "toggle-off": {
        return userIcon;
      }

      case "toggle-on": {
        return adminIcon;
      }
    }

    if (getEOfficeMenu(icon)) {
      return getEOfficeMenu(icon)?.icon();
    }

    return undefined;
  },
});

export function getPageImageUrl(page: (typeof source)["$inferPage"]) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url:
      "/" +
      [page.locale, ...docsImageRoute.split("/"), ...segments]
        .filter(Boolean)
        .join("/"),
  };
}

export function getPageMarkdownUrl(page: (typeof source)["$inferPage"]) {
  const segments = [...page.slugs, "content.md"];

  return {
    segments,
    url:
      "/" +
      [page.locale, ...docsContentRoute.split("/"), ...segments]
        .filter(Boolean)
        .join("/"),
  };
}

export async function getLLMText(page: (typeof source)["$inferPage"]) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title} (${page.url})

${processed}`;
}
