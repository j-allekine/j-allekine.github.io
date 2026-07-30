import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    tags: z.array(z.string().min(1)).min(1),
    visual: z.object({
      type: z.enum(["dashboard", "flow", "table"]),
    }),
    featured: z.boolean(),
    featuredOrder: z.number().int().positive(),
    destination: z.string().min(1).optional(),
  }),
});

export const collections = { projects };
