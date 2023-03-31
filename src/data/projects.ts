import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import { marked } from 'marked';
import { compile } from 'html-to-text';

const projects = await getCollection('projects');

const tags: Set<string> = new Set(
  projects.reduce(
    (tags: string[], p) => [
      ...tags,
      ...p.data.tags.map((t: string) => t.toLowerCase()),
    ],
    []
  )
);

const convertExcerpt = compile({
  baseElements: {
    selectors: ['p'],
  },
  limits: {
    maxBaseElements: 1,
  },
  selectors: [
    { selector: 'a', format: 'inline' },
    { selector: 'em', format: 'inlineTag' },
    { selector: 'strong', format: 'inlineTag' },
  ],
});

const getExcerpt = (
  item: CollectionEntry<'projects'>,
  excerptSeparator: string | RegExp = /<!-- ?more ?-->/
): string => {
  const excerpt =
    item.data.excerpt ||
    item.body.split(excerptSeparator)[0].trim() ||
    item.body;
  return convertExcerpt(marked.parse(excerpt));
};

export { projects, tags, getExcerpt };
