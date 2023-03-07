import { z, defineCollection } from 'astro:content';

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    url: z.string().url(),
    repository: z.string().url().optional(),
    tags: z.array(z.string()),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    published: z.boolean().optional(),
  }),
});

export const collections = { projects };
