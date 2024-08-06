// see https://github.com/colinhacks/zod

import { ProjectTag } from '@data/tags';
import { z, defineCollection } from 'astro:content';

// Projects

const projectLink = z.union([
  z.string().url(),
  z.object({
    url: z.string().url(),
    text: z.string(),
  }),
]);

export type ProjectLink = z.infer<typeof projectLink>;

const projectImage = z.union([
  z.string(),
  z.object({
    src: z.string(),
    alt: z.string(),
  }),
]);

export type ProjectImage = z.infer<typeof projectImage>;

const projects = defineCollection({
  type: 'content', // maybe switch to data...
  schema: z.object({
    title: z.string(),
    links: z.array(projectLink),
    tags: z.array(z.enum(ProjectTag)),
    excerpt: z.string().optional(),
    images: z.array(projectImage).optional(),
    published: z.boolean().optional(), // prob rename or redo...this means published as a post (which none are)
    draft: z.boolean().optional(),
    created: z.coerce.date(),
  }),
});

// Blog

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    excerpt: z.string().optional(),
    image: projectImage.optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = { projects, blog };
