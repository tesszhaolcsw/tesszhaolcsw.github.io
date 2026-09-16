import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postSchema = z.object({
  title: z.string(),
  summary: z.string(),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  draft: z.boolean().default(true),
  featured: z.boolean().default(false),
  featuredImage: z.string().optional(),
  imageAlt: z.string().optional(),
  author: z.string().default('Tess Zhao, LCSW'),
  category: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  translationKey: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.featuredImage && !data.imageAlt) {
    ctx.addIssue({ code: 'custom', path: ['imageAlt'], message: 'Image alt text is required when a featured image is used.' });
  }
});

export const collections = {
  blogEn: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './content/blog/en' }),
    schema: postSchema
  }),
  blogZh: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './content/blog/zh' }),
    schema: postSchema
  })
};
