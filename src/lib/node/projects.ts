import type { CollectionEntry } from 'astro:content';
import type { ProjectImage, ProjectLink } from '../../content/config';
import type { ProjectLink as ProjectPreviewLink } from '@components/ProjectPreview';
import type { ImageProps } from '@components/Image';

import path from 'node:path';
import { marked } from 'marked';
import { compile } from 'html-to-text';

import { fileExists } from '@build/utils';
import imageConfig from '@build/image-config';
import { getIcon, urlToIconKey, type DataIcon } from '../icons';

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

export interface ExcerptCollection {
  body: string;
  data: {
    excerpt?: string;
  };
}

export const getExcerpt = (
  item: ExcerptCollection,
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
  return imageConfig.metadataFromSizes(await resolvePath(src), {
    sizes,
    alt,
  });
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
  const icon = urlToIconKey(url);
  return {
    url,
    icon,
    text: text ?? (getIcon(icon ?? '')?.name || 'Visit'),
    externalLink: true,
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
      externalLink: false,
    });

  return previewLinks;
};

export const getIconsFromTags = (
  project: CollectionEntry<'projects'>
): DataIcon[] =>
  project.data.tags
    .map((tag) => getIcon(tag))
    .filter((i): i is DataIcon => Boolean(i));
