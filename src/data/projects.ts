import type { CollectionEntry } from 'astro:content';
import type { ProjectImage, ProjectLink } from '../content/config';
import type { ProjectLink as ProjectPreviewLink } from '@components/ProjectPreview';
import type { ImageProps } from '@components/Image';

import fsp from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';
import { compile } from 'html-to-text';

import imageConfig from '@build/image-config';
import {
  getIcon,
  getIconFromUrl,
  getDefaultIconDefinition,
  DataIcon,
} from '@data/icons';
import { faArrowUpRightFromSquare } from '@fortawesome/pro-solid-svg-icons/faArrowUpRightFromSquare';

const fileExists = (file: string): Promise<boolean> =>
  fsp
    .stat(file)
    .then(() => true)
    .catch((e) => {
      if (e.code === 'ENOENT') return false;
      else throw e;
    });

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

/*
 * Handle icons
 */

export const getPreviewLink = (link: ProjectLink): ProjectPreviewLink => {
  const { url, text } =
    typeof link === 'object' ? link : { url: link, text: null };
  const icon = getIconFromUrl(url);
  return {
    url,
    text: text ?? (icon ? icon.name : 'Visit'),
    icon: icon ? getDefaultIconDefinition(icon) : faArrowUpRightFromSquare,
  };
};

export const getPreviewLinks = (
  project: CollectionEntry<'projects'>
): ProjectPreviewLink[] => {
  const { links, published } = project.data;
  const previewLinks = links.map(getPreviewLink);
  if (published)
    previewLinks.unshift({
      url: `/projects/${project.slug}`,
      text: 'Read more',
      icon: faArrowUpRightFromSquare,
    });

  return previewLinks;
};

export const getIconsFromTags = (
  project: CollectionEntry<'projects'>
): DataIcon[] =>
  project.data.tags
    .map((tag) => getIcon(tag))
    .filter((i): i is DataIcon => Boolean(i));
