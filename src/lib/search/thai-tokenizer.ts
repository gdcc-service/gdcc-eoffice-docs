import type { createFromSource } from "fumadocs-core/search/server";

type SearchTokenizer = NonNullable<
  NonNullable<Parameters<typeof createFromSource>[1]>["tokenizer"]
>;

const wordSegmenter = new Intl.Segmenter("th", { granularity: "word" });
const fallbackWordPattern = /[\p{L}\p{N}]+/gu;

function normalizeToken(token: string): string {
  return token.normalize("NFKC").toLocaleLowerCase("th").trim();
}

function fallbackTokenize(input: string): string[] {
  return Array.from(input.matchAll(fallbackWordPattern), ([match]) =>
    normalizeToken(match),
  ).filter(Boolean);
}

function segmentWords(input: string): string[] {
  if (typeof Intl.Segmenter !== "function") {
    return fallbackTokenize(input);
  }

  const tokens = Array.from(wordSegmenter.segment(input), ({ segment, isWordLike }) => {
    if (isWordLike === false) return "";

    return normalizeToken(segment);
  }).filter(Boolean);

  return tokens.length > 0 ? tokens : fallbackTokenize(input);
}

export const thaiSearchTokenizer: SearchTokenizer = {
  language: "thai",
  tokenize(input) {
    if (typeof input !== "string") return [input];

    return Array.from(new Set(segmentWords(input)));
  },
};
