export interface PageMetadata {
  title: string;
  description: string;
}

export interface SiteConfig {
  ownerName: string;
  homepage: {
    metadata: PageMetadata;
    roleLabel: string;
    statement: string;
    introduction: string;
    workLinkLabel: string;
  };
  capabilities: readonly {
    title: string;
    summary: string;
  }[];
  contact: {
    email?: string;
    resumeUrl?: string;
    githubUrl?: string;
  };
  location?: string;
  footerText: string;
}

export interface ProjectMedia {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  featured: boolean;
}

export interface ProjectResult {
  kind: 'verified-measurement' | 'qualitative';
  before?: string;
  after: string;
}

export interface Project {
  slug: string;
  number: string;
  category: string;
  title: string;
  summary: string;
  role: string;
  timeline: string;
  year: string;
  tools: readonly string[];
  industryOrSystemType: string;
  metadata: PageMetadata;
  problem: readonly string[];
  solution: {
    description: string;
    workflowSteps: readonly string[];
    primaryMedia?: ProjectMedia;
  };
  contribution: readonly string[];
  results: readonly ProjectResult[];
  keyDecisions: readonly {
    decision: string;
    reasoning: string;
    tradeoff: string;
  }[];
  gallery: readonly ProjectMedia[];
}

export const siteConfig = {
  ownerName: 'J. Allekine',
  homepage: {
    metadata: {
      title: 'Operational Improvement Portfolio | J. Allekine',
      description:
        'A provisional portfolio presenting operational improvement case studies by J. Allekine.',
    },
    roleLabel: 'Operational problem-solver · Provisional introduction',
    statement: 'Operational improvement work, documented clearly.',
    introduction:
      'This provisional portfolio will show how inefficient or unreliable work is understood and improved through practical systems.',
    workLinkLabel: 'Review featured work',
  },
  capabilities: [],
  contact: {},
  footerText: 'Provisional portfolio',
} satisfies SiteConfig;

export const projects = [
  {
    slug: 'project-details-pending',
    number: '01',
    category: 'Category pending',
    title: 'Project title pending',
    summary: 'Problem, decisions, and outcome pending owner input.',
    role: 'Role pending',
    timeline: 'Timeline pending',
    year: 'Year pending',
    tools: ['Tools pending'],
    industryOrSystemType: 'System type pending',
    metadata: {
      title: 'Case Study Pending | J. Allekine',
      description:
        'A provisional case-study overview. Project facts are pending owner input.',
    },
    problem: ['Problem details pending owner input.'],
    solution: {
      description: 'Solution details pending owner input.',
      workflowSteps: [],
    },
    contribution: [],
    results: [],
    keyDecisions: [],
    gallery: [],
  },
] satisfies readonly Project[];
