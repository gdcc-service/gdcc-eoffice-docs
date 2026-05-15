import { source } from '@/lib/source';
import { thaiSearchTokenizer } from '@/lib/search/thai-tokenizer';
import { createFromSource } from 'fumadocs-core/search/server';

export const { GET } = createFromSource(source, {
  tokenizer: thaiSearchTokenizer,
});
