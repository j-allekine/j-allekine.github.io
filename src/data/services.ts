export type ServiceVisual = "spreadsheet" | "automation" | "web-app";

export interface Service {
  title: string;
  description: string;
  tags: string[];
  visual: ServiceVisual;
}

export const services: Service[] = [
  {
    title: "Spreadsheet & Data Systems",
    description: "Turn operational spreadsheets into reliable systems for tracking, reporting, inventory, finance, and day-to-day data.",
    tags: ["Tracking", "Reporting", "Dashboards"],
    visual: "spreadsheet",
  },
  {
    title: "Workflow Automation",
    description: "Connect repetitive work across your tools, data, documents, and notifications so less time is spent moving things manually.",
    tags: ["Data movement", "Documents", "Notifications"],
    visual: "automation",
  },
  {
    title: "Internal Tools & Web Apps",
    description: "Build lightweight tools for workflows that need more structure, clearer roles, or a better interface than a spreadsheet can provide.",
    tags: ["Operations", "Data entry", "Internal apps"],
    visual: "web-app",
  },
];
