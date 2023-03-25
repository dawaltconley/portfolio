import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

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

const getExcerpt = (
  item: CollectionEntry<'projects'>,
  excerptSeparator: string | RegExp = /<!-- ?more ?-->/
): string => {
  // console.log(item);
  if (item.data.excerpt) {
    return item.data.excerpt;
  } else if (excerptSeparator) {
    let parts = item.body.split(excerptSeparator);
    if (parts.length > 1) return parts[0].trim();
  }
  return (
    item.body
      .trim()
      .split('\n\n')
      .slice(0, 10)
      .find((line) => /^[a-z]/i.test(line)) ?? ''
  );
};

export { projects, tags, getExcerpt };
