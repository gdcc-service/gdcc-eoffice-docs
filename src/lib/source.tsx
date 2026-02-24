import { docs } from "fumadocs-mdx:collections/server";
import { type InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFirstdraft } from "@fortawesome/free-brands-svg-icons";
import {
  faHouse,
  faScrewdriverWrench,
  faBook,
  faFileSignature,
  faCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  // plugins: [lucideIconsPlugin()],
  icon(icon) {
    switch (icon) {
      case "quickstart": {
        return <FontAwesomeIcon icon={faCircleQuestion} />;
      }
      case "portal": {
        return <FontAwesomeIcon icon={faHouse} style={{ color: "#177fff" }} />;
      }
      case "admin-tools": {
        return (
          <FontAwesomeIcon
            icon={faScrewdriverWrench}
            style={{ color: "#fecb3e" }}
          />
        );
      }
      case "draft": {
        return (
          <FontAwesomeIcon
            icon={faFirstdraft}
            style={{ color: "rgb(253, 126, 20)" }}
          />
        );
      }
      case "saraban": {
        return <FontAwesomeIcon icon={faBook} style={{ color: "#ff8080" }} />;
      }
      case "in-tray": {
        return (
          <FontAwesomeIcon
            icon={faFileSignature}
            style={{ color: "#c68357" }}
          />
        );
      }
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
