import type { CollectionEntry } from 'astro:content';
import type { ProjectImage } from '../content/config';
import type { ImageProps } from '@components/Image';
import { getCollection } from 'astro:content';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';
import { compile } from 'html-to-text';
import imageConfig from '@build/image-config';

const fileExists = (file: string): Promise<boolean> =>
  fsp
    .stat(file)
    .then(() => true)
    .catch((e) => {
      if (e.code === 'ENOENT') return false;
      else throw e;
    });

export const projects = await getCollection('projects');

/*
 * Handle tags
 */

export const tags: Set<string> = new Set(
  projects.reduce(
    (tags: string[], p) => [
      ...tags,
      ...p.data.tags.map((t: string) => t.toLowerCase()),
    ],
    []
  )
);

/*
 * Handle excerpts
 */

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

export const getExcerpt = (
  item: CollectionEntry<'projects'>,
  excerptSeparator: string | RegExp = /<!-- ?more ?-->/
): string => {
  const excerpt =
    item.data.excerpt ||
    item.body.split(excerptSeparator)[0].trim() ||
    item.body;
  return convertExcerpt(marked.parse(excerpt));
};

/*
 * Handle images
 */

const searchPaths: string[] = [
  path.resolve('.'),
  path.resolve('./src/content/projects'),
  path.resolve('./src/assets/images'),
];

export const resolvePath = async (file: string): Promise<string> => {
  for (const p of searchPaths) {
    const resolved = path.resolve(p, file);
    if (await fileExists(resolved)) return resolved;
  }
  throw new Error(`Couldn't resolve path for project file: ${file}`);
};

export const normalizeImage = (
  image: ProjectImage
): Exclude<ProjectImage, string> =>
  typeof image === 'object' ? image : { src: image, alt: '' };

export const generateImage = async (
  image: ProjectImage,
  sizes: string
): Promise<ImageProps> => {
  const { src, alt } = normalizeImage(image);
  return {
    metadata: await imageConfig.metadataFromSizes(await resolvePath(src), {
      sizes,
    }),
    sizes,
    alt,
  };
};

export const generateImages = (
  project: CollectionEntry<'projects'>,
  sizes: string
): Promise<ImageProps[]> | undefined =>
  project.data.images &&
  Promise.all(project.data.images.map((image) => generateImage(image, sizes)));
