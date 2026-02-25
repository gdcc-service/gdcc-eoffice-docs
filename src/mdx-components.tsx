import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { Step, Steps } from "fumadocs-ui/components/steps";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Accordion,
    Accordions,
    Step,
    Steps,
    img: (props) => (
      <ImageZoom
        {...(props as any)}
        className="max-h-96 mx-auto object-contain"
      />
    ),
    Video: ({ src }) => (
      <div
        style={{
          position: "relative",
          paddingBottom: "56.25%" /* 16:9 Aspect Ratio */,
          height: 0,
          overflow: "hidden",
          marginBottom: "1rem",
        }}
      >
        <iframe
          src={src}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
          allow="encrypted-media; crossorigin; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    ),
    ...components,
  };
}
