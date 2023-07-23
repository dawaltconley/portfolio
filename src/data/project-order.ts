import type { CollectionEntry } from 'astro:content';

type ProjectSlug = CollectionEntry<'projects'>['slug'];

const projects: ProjectSlug[] = [
  // websites
  '42renew',
  'jahleelhills',
  'robertgdon',
  'moretongues',
  'onyxrenewables',
  'seniorinfluence',
  // apps
  'chinese-flashcards',
  'skytunes',
  'birdog',
  // packages
  'responsive-images',
  'sass-tailwind-functions',
  'sass-cast',
  'sass-parallax',
  'sass-themes',
  'scss-properties',
  'liquid-args',
  'bg-size-parser',
  'legislative-parser',
  'cloudformation',
  'cloudfront-redirects',
];

export default projects;
