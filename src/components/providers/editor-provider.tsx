"use client";

import { EditorProvider } from "fumadocs-editor/components";
import { mdxEditorAdapter } from "fumadocs-editor/adapters/mdx-editor";
import "@mdxeditor/editor/style.css";

import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Callout } from "fumadocs-ui/components/callout";

export function EditorProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EditorProvider
      adapter={mdxEditorAdapter}
      jsxComponentDescriptors={[
        {
          name: "Callout",
          kind: "flow",
          hasChildren: true,
          props: [
            { name: "type", type: "string" },
            { name: "title", type: "string" },
          ],
        },
        {
          name: "Steps",
          kind: "flow",
          hasChildren: true,
        },
        {
          name: "Step",
          kind: "flow",
          hasChildren: true,
        },
        {
          name: "Accordions",
          kind: "flow",
          hasChildren: true,
        },
        {
          name: "Accordion",
          kind: "flow",
          hasChildren: true,
          props: [
            { name: "type", type: "string" },
            { name: "title", type: "string" },
          ],
        },
      ]}
      mdxComponents={{ Callout, Step, Steps, Accordion, Accordions }}
    >
      {children}
    </EditorProvider>
  );
}
