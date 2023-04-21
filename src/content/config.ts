import { z, defineCollection } from 'astro:content';

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    links: z.array(z.string().url()),
    repository: z.string().url().optional(),
    tags: z.array(z.string()),
    excerpt: z.string().optional(),
    images: z
      .array(
        z.union([
          z.string(),
          z.object({
            src: z.string(),
            alt: z.string(),
          }),
        ])
      )
      .optional(),
    published: z.boolean().optional(),
  }),
});

export const collections = { projects };
