import { getCollection, type CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"projects">;
export type ProjectVisual = Project["data"]["visual"]["type"];

const byFeaturedOrder = (first: Project, second: Project) =>
  first.data.featuredOrder - second.data.featuredOrder;

export const getFeaturedProjects = async () =>
  (await getCollection("projects", ({ data }) => data.featured)).sort(byFeaturedOrder);

export const getProjects = async () =>
  (await getCollection("projects")).sort(byFeaturedOrder);
