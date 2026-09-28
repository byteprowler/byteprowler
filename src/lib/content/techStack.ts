export type TechCategoryCode =
  | "ALL_SYSTEMS"
  | "FRONTEND_CORE"
  | "FRAMEWORKS"
  | "STYLING_AND_MOTION"
  | "BACKEND_AND_DATA"
  | "SCRIPTING"
  | "DEVELOPMENT_TOOLS";

export type TechCategoryId =
  | TechCategoryCode
  // Backward compatibility aliases
  | "ALL"
  | "CORE"
  | "STYLING"
  | "BACKEND"
  | "TOOLS";

export type TechStatus = "CORE" | "ACTIVE" | "LEARNING";

export interface TechCategory {
  id: TechCategoryId;
  label: string;
}

export interface TechItem {
  name: string;
  category: TechCategoryId;
  status: TechStatus;
  level?: string;
  description?: string;
  experience?: number;
  projectsUsed?: number;
  icon?: string;
  nodeId?: string;
  highlights?: string[];
  documentationUrl?: string;
}

export const techCategories: TechCategory[] = [
  { id: "ALL_SYSTEMS", label: "ALL_SYSTEMS" },
  { id: "FRONTEND_CORE", label: "FRONTEND_CORE" },
  { id: "FRAMEWORKS", label: "FRAMEWORKS" },
  { id: "STYLING_AND_MOTION", label: "STYLING_AND_MOTION" },
  { id: "BACKEND_AND_DATA", label: "BACKEND_AND_DATA" },
  { id: "SCRIPTING", label: "SCRIPTING" },
  { id: "DEVELOPMENT_TOOLS", label: "DEVELOPMENT_TOOLS" },
];

export function normalizeCategory(category: string): TechCategoryCode {
  switch (category) {
    case "CORE":
    case "FRONTEND_CORE":
      return "FRONTEND_CORE";
    case "FRAMEWORKS":
      return "FRAMEWORKS";
    case "STYLING":
    case "STYLING_AND_MOTION":
      return "STYLING_AND_MOTION";
    case "BACKEND":
    case "BACKEND_AND_DATA":
      return "BACKEND_AND_DATA";
    case "SCRIPTING":
      return "SCRIPTING";
    case "TOOLS":
    case "DEVELOPMENT_TOOLS":
      return "DEVELOPMENT_TOOLS";
    default:
      return "FRONTEND_CORE";
  }
}

export function isCategoryMatch(itemCategory: string, selectedCategory: TechCategoryId): boolean {
  if (selectedCategory === "ALL" || selectedCategory === "ALL_SYSTEMS") {
    return true;
  }
  return normalizeCategory(itemCategory) === normalizeCategory(selectedCategory);
}

export const techStack: TechItem[] = [
  {
    name: "HTML5",
    category: "FRONTEND_CORE",
    status: "CORE",
    description: "Semantic structure for accessible, standards-compliant, and high-performance web applications.",
    experience: 3,
    projectsUsed: 18,
    icon: "Code2",
    nodeId: "NODE_001",
    level: "EXPERT",
    highlights: ["Semantic HTML", "ARIA Landmarks", "SEO Microdata", "Web Accessibility (WCAG AA)"],
  },
  {
    name: "CSS3",
    category: "FRONTEND_CORE",
    status: "CORE",
    description: "Responsive layout architecture, modern CSS custom properties, grid layouts, and hardware animations.",
    experience: 3,
    projectsUsed: 18,
    icon: "Palette",
    nodeId: "NODE_002",
    level: "EXPERT",
    highlights: ["CSS Grid & Flexbox", "Custom Properties", "Hardware-accelerated transforms", "Responsive Media Queries"],
  },
  {
    name: "JavaScript",
    category: "FRONTEND_CORE",
    status: "CORE",
    description: "The primary runtime engine powering interactive client interfaces, asynchronous flows, and DOM systems.",
    experience: 3,
    projectsUsed: 18,
    icon: "FileCode",
    nodeId: "NODE_003",
    level: "EXPERT",
    highlights: ["ESNext Syntax", "Event Loop & Promises", "DOM API Manipulation", "Performance Profiling"],
  },
  {
    name: "TypeScript",
    category: "FRONTEND_CORE",
    status: "CORE",
    description: "Strict compile-time type validation, generics, and interface contracts for maintainable enterprise codebases.",
    experience: 2,
    projectsUsed: 14,
    icon: "CodeXml",
    nodeId: "NODE_004",
    level: "ADVANCED",
    highlights: ["Strict Type Safety", "Discriminated Unions", "Generics & Utility Types", "AST & Type Narrowing"],
  },
  {
    name: "React",
    category: "FRAMEWORKS",
    status: "CORE",
    description: "Component architecture for expressive, stateful, and reusable interface systems.",
    experience: 3,
    projectsUsed: 15,
    icon: "Atom",
    nodeId: "NODE_005",
    level: "EXPERT",
    highlights: ["React 19 Hooks", "Server Components", "Context & Reducers", "Render Optimization"],
  },
  {
    name: "Next.js",
    category: "FRAMEWORKS",
    status: "ACTIVE",
    description: "Fullstack React delivery platform supporting Pages & App routers, edge compute, and native API routes.",
    experience: 3,
    projectsUsed: NaN,
    icon: "Layers",
    nodeId: "NODE_006",
    level: "ADVANCED",
    highlights: ["SSR / SSG / ISR", "API Route Endpoints", "Next Image Optimization", "SEO Metadata Primitives"],
  },
  {
    name: "Vue",
    category: "FRAMEWORKS",
    status: "ACTIVE",
    description: "Progressive frontend framework leveraging the Composition API, reactive state refs, and single-file components.",
    experience: 1,
    projectsUsed: 2,
    icon: "Component",
    nodeId: "NODE_007",
    level: "INTERMEDIATE",
    highlights: ["Composition API", "Vue Router", "Pinia State Store", "Single File Components"],
  },
  {
    name: "Angular",
    category: "FRAMEWORKS",
    status: "LEARNING",
    description: "Structured frontend framework utilized for enterprise applications, dependency injection, and RxJS pipelines.",
    experience: 1,
    projectsUsed: 1,
    icon: "Box",
    nodeId: "NODE_008",
    level: "FOUNDATIONAL",
    highlights: ["TypeScript Directives", "RxJS Observables", "Dependency Injection", "Signals Architecture"],
  },
  {
    name: "Nuxt",
    category: "FRAMEWORKS",
    status: "LEARNING",
    description: "Vue full-stack meta-framework offering auto-imports, file-system routing, and server rendering.",
    experience: 1,
    projectsUsed: 1,
    icon: "Boxes",
    nodeId: "NODE_009",
    level: "FOUNDATIONAL",
    highlights: ["Auto-Imports", "Server Engine Nitro", "Universal Rendering", "Modular Vue Architecture"],
  },
  {
    name: "Tailwind CSS",
    category: "STYLING_AND_MOTION",
    status: "CORE",
    description: "Utility-first design system architecture for rapid, consistent, and responsive UI development.",
    experience: 3,
    projectsUsed: 14,
    icon: "Wind",
    nodeId: "NODE_010",
    level: "EXPERT",
    highlights: ["Tailwind v4 Theme Engine", "Responsive Utilities", "Custom Plugins & Tokens", "Arbitrary Variants"],
  },
  {
    name: "motion.dev",
    category: "STYLING_AND_MOTION",
    status: "ACTIVE",
    description: "High-performance motion library powering spring physics, gesture tracking, layout animations, and transitions.",
    experience: 2,
    projectsUsed: 8,
    icon: "Sparkles",
    nodeId: "NODE_011",
    level: "ADVANCED",
    highlights: ["Spring Dynamics", "AnimatePresence", "Layout Morphing", "Reduced-Motion Fallbacks"],
  },
  {
    name: "Vite",
    category: "STYLING_AND_MOTION",
    status: "ACTIVE",
    description: "Next-generation frontend tooling providing lightning-fast ESM hot module replacement and Rollup builds.",
    experience: 1,
    projectsUsed: 5,
    icon: "Zap",
    nodeId: "NODE_012",
    level: "INTERMEDIATE",
    highlights: ["Native ESM Dev Server", "Rollup Production Bundles", "Plugin Ecosystem", "Optimized Assets"],
  },
  {
    name: "Node.js",
    category: "BACKEND_AND_DATA",
    status: "LEARNING",
    description: "Event-driven asynchronous JavaScript runtime for backend services, automation scripts, and server tooling.",
    experience: 1,
    projectsUsed: 5,
    icon: "Server",
    nodeId: "NODE_013",
    level: "INTERMEDIATE",
    highlights: ["REST API Endpoints", "Event-Driven I/O", "NPM Modules", "Process Management"],
  },
  {
    name: "Python",
    category: "BACKEND_AND_DATA",
    status: "LEARNING",
    description: "Versatile programming language utilized for automation scripts, data handling, and backend logic.",
    experience: 1,
    projectsUsed: 2,
    icon: "Terminal",
    nodeId: "NODE_014",
    level: "INTERMEDIATE",
    highlights: ["Script Automation", "Data Parsing", "HTTP Client Scripts", "Standard Library"],
  },
  {
    name: "Django",
    category: "BACKEND_AND_DATA",
    status: "LEARNING",
    description: "High-level Python web framework encouraging clean, pragmatic design and rapid database delivery.",
    experience: 1,
    projectsUsed: 1,
    icon: "DatabaseZap",
    nodeId: "NODE_015",
    level: "FOUNDATIONAL",
    highlights: ["Django ORM", "Admin Dashboard", "Authentication Middleware", "REST Framework"],
  },
  {
    name: "SQL",
    category: "BACKEND_AND_DATA",
    status: "ACTIVE",
    description: "Relational querying language for schema design, multi-table joins, and performant data manipulation.",
    experience: 1,
    projectsUsed: 0,
    icon: "Database",
    nodeId: "NODE_016",
    level: "ADVANCED",
    highlights: ["PostgreSQL Dialects", "Normalized Relational Schemas", "Indexing & Query Plans", "Data Aggregations"],
  },
  {
    name: "Supabase",
    category: "BACKEND_AND_DATA",
    status: "LEARNING",
    description: "Open-source cloud platform providing managed PostgreSQL, Row-Level Security, Auth, and realtime listeners.",
    experience: 1,
    projectsUsed: 3,
    icon: "ShieldCheck",
    nodeId: "NODE_017",
    level: "INTERMEDIATE",
    highlights: ["Postgres Database", "Row Level Security", "Realtime Channels", "Edge Functions"],
  },
  {
    name: "Bash Scripting",
    category: "SCRIPTING",
    status: "LEARNING",
    description: "Unix shell scripting for environment orchestration, deployment pipelines, and developer workflows.",
    experience: 1,
    projectsUsed: 1,
    icon: "TerminalSquare",
    nodeId: "NODE_018",
    level: "INTERMEDIATE",
    highlights: ["Shell Pipelines", "Environment Automation", "CLI Tooling", "Process Execution"],
  },
  {
    name: "Git",
    category: "DEVELOPMENT_TOOLS",
    status: "CORE",
    description: "Distributed version control system for atomic commits, branching strategies, and traceable delivery.",
    experience: 3,
    projectsUsed: 18,
    icon: "GitBranch",
    nodeId: "NODE_019",
    level: "EXPERT",
    highlights: ["Interactive Rebase", "Branching Workflows", "Merge Conflict Resolution", "Submodules & Hooks"],
  },
  {
    name: "GitHub",
    category: "DEVELOPMENT_TOOLS",
    status: "CORE",
    description: "Collaboration, code hosting, GitHub Actions CI/CD workflows, pull requests, and security alerts.",
    experience: 3,
    projectsUsed: 18,
    icon: "Github",
    nodeId: "NODE_020",
    level: "EXPERT",
    highlights: ["GitHub Actions CI/CD", "Pull Request Reviews", "Release Automation", "Repository Secrets"],
  },
  {
    name: "Figma",
    category: "DEVELOPMENT_TOOLS",
    status: "LEARNING",
    description: "Interface planning, component design systems, layout wireframes, and developer handoff specs.",
    experience: 1,
    projectsUsed: 2,
    icon: "Figma",
    nodeId: "NODE_021",
    level: "INTERMEDIATE",
    highlights: ["Auto-Layout", "Design Tokens", "Component Variants", "Interactive Prototypes"],
  },
];
