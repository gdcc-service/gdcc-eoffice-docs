import { docs } from "fumadocs-mdx:collections/server";
import { type InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { editorPlugin } from "fumadocs-editor/plugin";

import { getEOfficeMenu } from "@/config";

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
    }

    if (getEOfficeMenu(icon)) {
      return getEOfficeMenu(icon)?.icon();
    }

    return undefined;
  },
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: `/og/docs/${segments.join("/")}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title}

${processed}`;
}
