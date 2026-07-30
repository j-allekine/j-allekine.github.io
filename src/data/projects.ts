export type ProjectVisual = "dashboard" | "flow" | "table";

export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  visual: ProjectVisual;
}

// Keep homepage project content in one collection-shaped module so it can move
// to an Astro content collection without changing the card component API.
export const projects: Project[] = [
  {
    slug: "pharmacy-inventory-system",
    title: "Pharmacy Inventory System",
    description: "Centralizes medicine movement, expiry monitoring, FIFO handling, reordering, sales, and reporting in one operational system.",
    tags: ["Excel", "Inventory", "Healthcare"],
    visual: "dashboard",
  },
  {
    slug: "hospital-ocr-automation-pipeline",
    title: "Hospital OCR Automation Pipeline",
    description: "Turns uploaded hospital forms into structured records while keeping human review inside the workflow for faster, cleaner processing.",
    tags: ["Apps Script", "OCR", "Google APIs"],
    visual: "flow",
  },
  {
    slug: "lgu-inventory-asset-system",
    title: "LGU Inventory & Asset System",
    description: "Creates one source of truth for consumable supplies, semi-expendable property, and fixed assets from receipt through disposal.",
    tags: ["Web App", "Government", "Assets"],
    visual: "table",
  },
];
