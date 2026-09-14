import { z } from 'zod';

export const postFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters long')
    .max(250, 'Title cannot exceed 250 characters'),
  slug: z
    .string()
    .max(250, 'Slug cannot exceed 250 characters')
    .optional()
    .or(z.literal('')),
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters long'),
  excerpt: z
    .string()
    .max(1000, 'Excerpt cannot exceed 1000 characters')
    .optional()
    .or(z.literal('')),
  cover_image_url: z
    .string()
    .url('Invalid cover image URL')
    .optional()
    .or(z.literal('')),
  category_id: z.string().nullable().optional(),
  meta_title: z.string().max(200).optional().or(z.literal('')),
  meta_description: z.string().max(500).optional().or(z.literal('')),
  og_image_url: z.string().optional().or(z.literal('')),
  published: z.boolean().default(false),
  published_at: z.string().optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
});

export type PostFormValues = z.infer<typeof postFormSchema>;
