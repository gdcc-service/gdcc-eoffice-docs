"use client";

import { useRegisterEditable } from "fumadocs-editor/components";
import type { EditMetadata } from "fumadocs-editor";

export function EditorRegister({
  editMetadata,
}: {
  editMetadata?: EditMetadata;
}) {
  useRegisterEditable(editMetadata);
  return null;
}
