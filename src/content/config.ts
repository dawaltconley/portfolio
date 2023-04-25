import { z, defineCollection } from 'astro:content';

const projectImage = z.union([
  z.string(),
  z.object({
    src: z.string(),
    alt: z.string(),
  }),
]);

export type ProjectImage = z.infer<typeof projectImage>;

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    links: z.array(z.string().url()),
    repository: z.string().url().optional(),
    tags: z.array(z.string()),
    excerpt: z.string().optional(),
    images: z.array(projectImage).optional(),
    published: z.boolean().optional(),
  }),
});

export const collections = { projects };
