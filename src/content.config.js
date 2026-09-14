import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Both collections are edited through Decap CMS (/admin) — keep the schemas
// in sync with public/admin/config.yml.

const insights = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/insights" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    image: z.string().optional(),
    seoTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
});

const mandates = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/mandates" }),
  schema: z.object({
    amount: z.string(),
    type: z.string(),
    sector: z.string(),
    order: z.number(),
  }),
});

export const collections = { insights, mandates };
