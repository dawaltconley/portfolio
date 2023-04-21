import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';
import { compile } from 'html-to-text';

const fileExists = (file: string): Promise<boolean> =>
  fsp
    .stat(file)
    .then(() => true)
    .catch((e) => {
      if (e.code === 'ENOENT') return false;
      else throw e;
    });

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

const searchPaths: string[] = [
  path.resolve('.'),
  path.resolve('./src/content/projects'),
  path.resolve('./src/assets/images'),
];

const resolvePath = async (file: string): Promise<string> => {
  for (const p of searchPaths) {
    const resolved = path.resolve(p, file);
    if (await fileExists(resolved)) return resolved;
  }
  throw new Error(`Couldn't resolve path for project file: ${file}`);
};

export { projects, tags, getExcerpt, resolvePath };
