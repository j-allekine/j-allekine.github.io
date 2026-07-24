export interface PageMetadata {
  title: string;
  description: string;
  canonicalUrl?: string;
  socialImageUrl?: string;
}

export interface HowIWorkStage {
  number: string;
  title: string;
  description: string;
  principle: string;
}

export interface JourneyMilestone {
  number: string;
  period: string;
  title: string;
  description: string;
  significance: string;
}

export interface SiteConfig {
  ownerName: string;
  homepage: {
    metadata: PageMetadata;
    roleLabel: string;
    statement: string;
    introduction: string;
    workLinkLabel: string;
    availability?: string;
  };
  capabilities: readonly {
    problem: string;
    improvement: string;
  }[];
  contact: {
    heading: string;
    introduction: string;
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
  contentStatus: 'guiding' | 'approved';
  category: string;
  title: string;
  summary: string;
  role: string;
  timeline: string;
  year: string;
  tools: readonly string[];
  industryOrSystemType: string;
  metadata: PageMetadata;
  problem: {
    whatWasHappening: string;
    whoWasAffected: string;
    whyItMattered: string;
  };
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
    availability: undefined,
  },
  capabilities: [
    {
      problem:
        'Repeated work consumes attention and makes avoidable errors more likely.',
      improvement:
        'Clarify the workflow, then automate the stable steps that benefit from consistent handling.',
    },
    {
      problem:
        'Scattered information and fragile handoffs make the current state difficult to trust.',
      improvement:
        'Structure the data and checks so people can see what needs attention and act with confidence.',
    },
    {
      problem:
        'Unclear ownership and exception paths leave work dependent on memory.',
      improvement:
        'Design practical steps, validation, and handoffs that make the process easier to run and maintain.',
    },
  ],
  contact: {
    heading: 'Bring the operational problem into focus.',
    introduction:
      'Share what is slowing the work down, where reliability breaks, and who the process needs to support.',
    email: import.meta.env.PUBLIC_CONTACT_EMAIL || undefined,
    resumeUrl: import.meta.env.PUBLIC_RESUME_URL || undefined,
    githubUrl: import.meta.env.PUBLIC_GITHUB_URL || undefined,
  },
  location: undefined,
  footerText: 'Provisional portfolio',
} satisfies SiteConfig;

export const howIWorkStages = [
  {
    number: '01',
    title: 'Understand',
    description:
      'Map the current workflow, the people involved, and the points where work becomes slow, unclear, or unreliable.',
    principle: 'Start with the work, not the tool.',
  },
  {
    number: '02',
    title: 'Design',
    description:
      'Define the simplest workable future state, including ownership, handoffs, decisions, and exception paths.',
    principle: 'Make responsibilities and trade-offs visible.',
  },
  {
    number: '03',
    title: 'Build',
    description:
      'Turn the agreed workflow into a practical system that fits the way the operation actually needs to run.',
    principle: 'Use only as much technology as the problem needs.',
  },
  {
    number: '04',
    title: 'Validate',
    description:
      'Test the system against realistic scenarios, expected failures, and the needs of the people who will use it.',
    principle: 'Evidence matters more than assumption.',
  },
  {
    number: '05',
    title: 'Improve',
    description:
      'Observe the system in use, remove new friction, and refine it as the operation and its constraints change.',
    principle: 'Treat improvement as an ongoing loop.',
  },
] satisfies readonly HowIWorkStage[];

export const selectedJourneyMilestones = [
  {
    number: '01',
    period: 'Date pending',
    title: 'Starting point',
    description:
      'Add the earliest experience that shaped how you understand operational work and the people affected by it.',
    significance:
      'Explain the change in perspective that still influences your work.',
  },
  {
    number: '02',
    period: 'Date pending',
    title: 'Expanding responsibility',
    description:
      'Add a concise milestone where the scope, complexity, or consequences of the work became more substantial.',
    significance:
      'Connect added responsibility to a stronger working principle.',
  },
  {
    number: '03',
    period: 'Date pending',
    title: 'Building practical systems',
    description:
      'Add a milestone that demonstrates the shift from handling isolated tasks to improving an entire workflow.',
    significance:
      'Show why systems thinking became part of your professional approach.',
  },
  {
    number: '04',
    period: 'Present',
    title: 'Current direction',
    description:
      'Describe the operational problems and working environments you want to contribute to next.',
    significance:
      'End with direction and relevance rather than a complete biography.',
  },
] satisfies readonly JourneyMilestone[];

interface GuidingProjectIdentity {
  slug: string;
  number: string;
  title: string;
  metadata: PageMetadata;
}

function createGuidingProject({
  slug,
  number,
  title,
  metadata,
}: GuidingProjectIdentity): Project {
  return {
    slug,
    number,
    contentStatus: 'guiding',
    category: 'Category pending',
    title,
    summary: 'Problem, decisions, and outcome pending owner input.',
    role: 'Role pending',
    timeline: 'Timeline pending',
    year: 'Year pending',
    tools: ['Tools pending'],
    industryOrSystemType: 'System type pending',
    metadata,
    problem: {
      whatWasHappening:
        'Current workflow conditions and reliability concerns pending owner input.',
      whoWasAffected:
        'People, teams, or customers affected by the workflow pending owner input.',
      whyItMattered:
        'Operational consequence and reason for prioritizing the work pending owner input.',
    },
    solution: {
      description:
        'Guiding workflow only. Replace each stage with the confirmed sequence used in this project.',
      workflowSteps: [
        'Current-state trigger and responsible owner — details pending.',
        'Decision points and exception path — details pending.',
        'Improved handoff and operational outcome — details pending.',
      ],
      primaryMedia: {
        src: '/media/workflow-primary-placeholder.svg',
        alt: 'Provisional workflow diagram placeholder with three ordered stages',
        caption:
          'Replace with the primary workflow diagram or main system screenshot.',
        width: 1600,
        height: 900,
        featured: false,
      },
    },
    contribution: [
      'Document the operational problem J. Allekine personally analyzed.',
      'Identify the workflow, validation, or automation work J. Allekine personally completed.',
      'Separate J. Allekine’s decisions from broader project or team activity.',
    ],
    results: [
      {
        kind: 'qualitative',
        before: 'Before observation pending owner input.',
        after: 'After observation pending owner input.',
      },
    ],
    keyDecisions: [
      {
        decision: 'Workflow-boundary decision pending owner input.',
        reasoning: 'Reasoning and evidence pending owner input.',
        tradeoff: 'Relevant trade-off pending owner input.',
      },
      {
        decision: 'Validation-approach decision pending owner input.',
        reasoning: 'Reasoning and evidence pending owner input.',
        tradeoff: 'Relevant trade-off pending owner input.',
      },
    ],
    gallery: [
      {
        src: '/media/gallery-system-placeholder.svg',
        alt: 'Provisional full-width placeholder for the case study’s strongest system evidence',
        caption:
          'Replace with the strongest visual that explains the system.',
        width: 1600,
        height: 900,
        featured: true,
      },
      {
        src: '/media/gallery-decision-placeholder.svg',
        alt: 'Provisional placeholder for a decision-detail artifact',
        caption:
          'Replace with evidence for a consequential project decision.',
        width: 1600,
        height: 900,
        featured: false,
      },
      {
        src: '/media/gallery-handoff-placeholder.svg',
        alt: 'Provisional placeholder for an operational-handoff artifact',
        caption:
          'Replace with evidence that clarifies an operational handoff.',
        width: 1600,
        height: 900,
        featured: false,
      },
    ],
  };
}

export const projects = [
  createGuidingProject({
    slug: 'workflow-improvement-details-pending',
    number: '01',
    title: 'Workflow improvement case study — details pending',
    metadata: {
      title: 'Workflow Improvement Case Study — Details Pending | J. Allekine',
      description:
        'A provisional case-study record for a workflow improvement project. Confirmed project facts are pending owner input.',
    },
  }),
  createGuidingProject({
    slug: 'spreadsheet-operations-details-pending',
    number: '02',
    title: 'Spreadsheet operations case study — details pending',
    metadata: {
      title:
        'Spreadsheet Operations Case Study — Details Pending | J. Allekine',
      description:
        'A provisional case-study record for a spreadsheet operations project. Confirmed project facts are pending owner input.',
    },
  }),
  createGuidingProject({
    slug: 'data-handoff-details-pending',
    number: '03',
    title: 'Data handoff case study — details pending',
    metadata: {
      title: 'Data Handoff Case Study — Details Pending | J. Allekine',
      description:
        'A provisional case-study record for a data handoff project. Confirmed project facts are pending owner input.',
    },
  }),
] satisfies readonly Project[];
