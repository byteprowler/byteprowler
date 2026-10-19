export interface ProjectVersion {
  label: string;
  title: string;
  description: string;
  liveUrl?: string;
  host?: string;
  status: string;
}

export type ProjectStatus = "COMPLETE" | "PROTOTYPE" | "ACTIVE_DEV";
export type RepoVisibility = "public" | "private" | "unavailable";
export type ProjectCategory = "featured" | "client" | "freelance" | "learning" | "fun" | "lab" | "fork";

export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  stack: string[];
  type: string;
  status: ProjectStatus;
  role: string;
  year: string;
  image?: string;
  coverImage?: string;
  ogImage?: string;
  githubUrl?: string;
  liveUrl?: string;
  repoVisibility?: RepoVisibility;
  githubOwner?: string;
  githubRepo?: string;
  useGithubMetadata?: boolean;
  preferGithubDescription?: boolean;
  category?: ProjectCategory;
  isFeatured?: boolean;
  showOnHome?: boolean;
  highlights: string[];
  currentVersion?: string;
  versions?: ProjectVersion[];
}

export function getHomepageProjects(limit = 6): Project[] {
  return [...projects]
    .filter((project) => project.showOnHome !== false)
    .sort((a, b) => Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)))
    .slice(0, limit);
}

export const projects: Project[] = [
  {
    slug: "prowlerpos",
    title: "ProwlerPOS",
    description: "A restaurant POS interface connecting sales, waiter ordering, kitchen operations, and business reporting through a unified workflow.",
    longDescription: "ProwlerPOS is a restaurant operations platform concept designed to connect front-of-house sales, tableside ordering, kitchen workflows, and back-office reporting in one system. The interface brings together a fast POS checkout experience, waiter ordering from phones or tablets, real-time kitchen tickets, payment handling, customer history, discounts, inventory alerts, staff performance metrics, and sales reporting. The project focuses on reducing the friction between taking an order and getting it prepared by keeping the POS, waiter workflow, and kitchen display synchronized.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    type: "Restaurant POS Platform",
    status: "PROTOTYPE",
    role: "Frontend Developer",
    year: "2026",
    category: "lab",
    isFeatured: false,
    showOnHome: false,
    repoVisibility: "public",
    liveUrl: "https://prowler-pos.vercel.app/",
    highlights: [
      "Designed a unified POS experience connecting front-of-house, waiter, kitchen, and reporting workflows.",
      "Structured the waiter-to-POS-to-kitchen workflow around real-time order synchronization.",
      "Designed high-speed checkout flows supporting items, categories, discounts, taxes, customer history, and split payments.",
      "Designed a kitchen display workflow with New, Preparing, and Ready order states for operational clarity.",
      "Presented sales tracking, inventory alerts, staff performance, and end-of-day reporting in a centralized dashboard.",
      "Built the product experience around modular POS, Waiter App, Kitchen Display System, and reporting workflows.",
    ],
  },
  {
    slug: "byteprowler-portfolio",
    title: "Byteprowler Portfolio",
    description: "Portfolio revamp showing the evolution from an initial personal site into the current Byteprowler hacker/terminal interface.",
    longDescription: "A personal portfolio rebuilt as a focused Byteprowler revamp using Next.js, Tailwind CSS, motion.dev, reusable sections, and server-side API routes for features like contact handling and view counting. The current version improves branding, personality, responsiveness, structure, accessibility, and the overall developer-story presentation without exposing client secrets.",
    stack: ["TypeScript", "React", "Tailwind CSS", "motion.dev", "Supabase"],
    type: "Portfolio Revamp",
    status: "ACTIVE_DEV",
    role: "Frontend Developer",
    year: "2026",
    category: "featured",
    isFeatured: true,
    showOnHome: true,
    currentVersion: "v2",
    githubUrl: "https://github.com/byteprowler/bytepr0wler",
    liveUrl: "https://byteprowler.vercel.app",
    repoVisibility: "public",
    highlights: [
      "Evolved from a basic personal portfolio into a branded Byteprowler revamp.",
      "Added terminal-inspired sections for projects, certifications, roadmap, anime feed, contact, and view count.",
      "Improved responsiveness, reusable component structure, accessibility details, and server-side handling for sensitive integrations.",
    ],
    versions: [
      {
        label: "v1",
        title: "Initial Portfolio",
        description: "A basic personal portfolio with earlier design and structure, created as the foundation for a public developer presence.",
        host: "Netlify",
        liveUrl: "https://byteprowler.netlify.com",
        status: "Archived",
      },
      {
        label: "v2",
        title: "Byteprowler Revamp",
        description: "The current hacker/terminal interface with improved branding, responsiveness, architecture, projects, certifications, roadmap, anime feed, contact flow, and view count.",
        host: "Vercel",
        liveUrl: "https://byteprowler.vercel.app",
        status: "Active",
      },
    ],
  },
  {
    slug: "giveroll",
    title: "Giveroll",
    description: "Giveaway platform MVP built around a wheel-based draw experience, with planned OBS livestream support to make winner selection more transparent and fair.",
    longDescription: "Giveroll is an unfinished giveaway platform concept focused on making online draws feel more transparent. The MVP centered on a wheel-based selection flow, with a broader plan to connect draw sessions to OBS-powered livestream workflows so audiences could watch results happen in real time. Development paused after the team reached the wheel MVP stage, so the project is presented as an honest prototype rather than a completed product.",
    stack: ["TypeScript", "React", "Tailwind CSS", "Next.js", "OBS Workflow"],
    type: "Giveaway Platform MVP",
    status: "PROTOTYPE",
    role: "Frontend Developer",
    year: "2026",
    category: "lab",
    showOnHome: true,
    repoVisibility: "private",
    liveUrl: "https://giveroll.vercel.app",
    highlights: [
      "Built the core wheel-based giveaway draw interface for the MVP stage.",
      "Explored a livestream-first fairness model where OBS could broadcast draw sessions and winner selection.",
      "Kept the project scoped as a prototype after team momentum stopped before the full platform was completed.",
    ],
    versions: [
      {
        label: "mvp",
        title: "Wheel Draw MVP",
        description: "Initial build focused on the interactive giveaway wheel and draw flow before the larger livestream platform work paused.",
        status: "Paused Prototype",
      },
    ],
  },
  {
    slug: "quickgas-admin-portal",
    title: "Quickgas Admin Portal",
    description: "High-performance fleet management console with real-time route tracing and delivery telemetry visualization.",
    longDescription: "A specialized fleet dashboard prototype designed for delivery tracking, transaction audit trails, and dense operational records. Uses responsive interface patterns to keep complex table and dashboard views readable across desktop and mobile viewports.",
    stack: ["React", "TypeScript", "Tailwind CSS", "D3.js", "Express", "PostgreSQL"],
    type: "Commercial SaaS",
    status: "PROTOTYPE",
    role: "Junior Frontend Engineer",
    year: "2025",
    category: "client",
    isFeatured: true,
    showOnHome: true,
    githubUrl: "https://github.com/byteprowler/quickgas-portal",
    repoVisibility: "private",
    highlights: [
      "Reduced render loop overhead during real-time map canvas route alterations by 42%.",
      "Seamless layout density management scaling custom spreadsheet boards from 1920px down to touch targets.",
      "Developed high-integrity transaction filter queries supporting rapid date range exports.",
    ],
  },

  {
    slug: "A-slime-s-guide-to-Elysium",
    title: "A Slime's Guide to Elysium",
    description: "Contributed engineering improvements to an open-source spoiler-controlled encyclopedia platform, focusing on dynamic chapter progression, structured character data, and scalable content updates for the webnovel Slime Evolution by NuNuXD",
    longDescription: "A chapter-aware encyclopedia system designed to preserve spoiler-free exploration while tracking character evolution, abilities, relationships, and world progression across a long-running serialized novel.",
    stack: ["Vite", "JavaScript", "TailwindCSS", "Svelte"],
    type: "Open Source Contribution",
    status: "PROTOTYPE",
    role: "Contributor / Frontend Developer",
    year: "2026",
    category: "fork",
    githubUrl: "https://github.com/byteprowler/A-slime-s-guide-to-Elysium",
    githubOwner: "FreeFallingRN",
    githubRepo: "A-slime-s-guide-to-Elysium",
    repoVisibility: "public",
    preferGithubDescription: true,
    useGithubMetadata: true,
    liveUrl: "https://freefallingrn.github.io/A-slime-s-guide-to-Elysium/",
    highlights: [
      "Improved dynamic chapter progression handling",
      "Enhanced encyclopedia data structures",
      "Added scalable chapter updated workflow",
      "Improved character progression representation",
      "Contributed spoiler-aware content handling"
    ],
  },

  {
    slug: "mentorled-landing",
    title: "MentorLed's Landing Page",
    description:
      "Frontend implementation of a professional landing page for MentorLed, focused on presenting a career acceleration platform through clean UI, responsive layouts, and structured user flows.",
    longDescription:
      "This project involved building a polished landing page experience for MentorLed, a platform focused on helping junior technology professionals gain real-world experience through project-based learning and mentorship. The implementation focused on translating product messaging into an intuitive interface using reusable components, responsive design principles, and modern frontend development practices. The goal was to create a professional digital presence that balances visual appeal, usability, and maintainable code architecture.",
    stack: ["Next.js", "TypeScript", "TailwindCSS", "Framer Motion"],
    type: "Landing Page",
    status: "PROTOTYPE",
    role: "Junior Frontend Developer",
    year: "2025",
    category: "learning",
    githubUrl: "https://github.com/byteprowler/mentorled-landing",
    githubOwner: "byteprowler",
    githubRepo: "mentorled-landing",
    repoVisibility: "public",
    preferGithubDescription: true,
    useGithubMetadata: true,
    liveUrl: "https://mentorled-landing-nine.vercel.app/",
    highlights: [
      "Translated product requirements into a responsive marketing experience.",
      "Developed reusable UI components to maintain consistency across sections.",
      "Implemented modern frontend patterns with a focus on maintainability and scalability.",
      "Optimized layouts and interactions for smooth experiences across screen sizes.",
      "Improved content presentation through spacing, typography, and visual hierarchy decisions."
    ],
  },

  {
    slug: "mentorled-admin",
    title: "MentorLed Admin Interface",
    description:
      "An internal admin dashboard interface designed to support platform management, user operations, and content workflows for MentorLed's work-experience accelerator platform.",
    longDescription:
      "An administrative dashboard experience built to support the operational side of MentorLed's work-experience accelerator platform. The interface focuses on creating a structured workspace for managing platform activities through organized layouts, reusable components, and scalable dashboard patterns. The project involved designing internal tooling that prioritizes clarity, efficient navigation, and maintainable frontend architecture while handling complex business workflows behind a mentorship and project-based learning ecosystem.",
    stack: ["Next.js", "TypeScript", "TailwindCSS", "Framer Motion"],
    type: "SaaS Admin Dashboard",
    status: "PROTOTYPE",
    role: "Junior Frontend Developer",
    year: "2025",
    githubUrl: "https://github.com/byteprowler/mentorled-admin",
    githubOwner: "byteprowler",
    githubRepo: "mentorled-admin",
    useGithubMetadata: true,  
    repoVisibility: "public",
    preferGithubDescription: true,
    liveUrl: "https://mentorled-admin.vercel.app/",
    category: "learning",
    highlights: [
      "Designed a scalable admin dashboard structure for managing platform operations.",
      "Created reusable UI components for consistent dashboard experiences.",
      "Implemented responsive layouts suitable for different screen sizes and workflows.",
      "Focused on clear information hierarchy for complex administrative tasks.",
      "Applied modern frontend architecture patterns to improve maintainability and future feature expansion."
    ],
  },
  {
    slug: "mentorled-multi-step-form",
    title: "MentorLed Multi-Step Form",
    description:
      "A multi-step onboarding experience designed to collect user information through a structured and intuitive form flow with a focus on usability and smooth progression.",
    longDescription:
      "A multi-step onboarding interface built to simplify user information collection by dividing complex inputs into clear, manageable stages. The project focuses on creating a smoother onboarding experience through progressive disclosure, structured navigation, responsive layouts, and reusable form components. The implementation explores how thoughtful UI decisions can reduce friction during data entry while maintaining a clean and accessible user journey.",
    stack: ["Next.js", "TypeScript", "TailwindCSS", "Framer Motion"],
    type: "Onboarding Flow",
    status: "PROTOTYPE",
    role: "Junior Frontend Developer",
    year: "2025",
    category: "learning",
    githubUrl: "https://github.com/byteprowler/mentorled-form",
    githubOwner: "byteprowler",
    useGithubMetadata: true,
    repoVisibility: "public",
    preferGithubDescription: true,
    liveUrl: "https://mentorled-form.vercel.app/",
    highlights: [
      "Designed a step-based onboarding flow that improves user progression through complex forms.",
      "Implemented reusable form components and structured input patterns for maintainability.",
      "Created clear navigation between steps with a focus on usability and user feedback.",
      "Optimized the interface for responsive experiences across different devices.",
      "Applied modern frontend practices to create a clean and scalable form architecture."
    ],
  },
  {
    slug: "mentorled-product-showcase",
    title: "Product Showcase",
    description:
      "A product showcase interface designed to present digital offerings through structured layouts, visual storytelling, and an engaging browsing experience.",
    longDescription:
      "A product-focused frontend experience created to showcase offerings through a clean and structured presentation layer. The project focuses on helping users discover and understand products through carefully designed sections, responsive layouts, clear content hierarchy, and interactive UI patterns. The implementation explores modern frontend techniques for building visually engaging product pages while maintaining reusable components and scalable architecture.",
    stack: ["Next.js", "TypeScript", "TailwindCSS", "Framer Motion"],
    type: "Product Showcase",
    status: "PROTOTYPE",
    role: "Junior Frontend Developer",
    year: "2025",
    category: "learning",
    githubUrl: "https://github.com/byteprowler/mentorled-product",
    githubOwner: "byteprowler",
    useGithubMetadata: true,
    repoVisibility: "public",
    preferGithubDescription: true,
    liveUrl: "https://mentorled-product.vercel.app/",
    highlights: [
      "Designed a product presentation interface focused on clarity and user engagement.",
      "Built reusable components for displaying product information consistently.",
      "Implemented responsive layouts optimized across different screen sizes.",
      "Focused on typography, spacing, and visual hierarchy to improve product discovery.",
      "Applied modern frontend development practices for maintainable and scalable UI."
    ],
  },
  // {
  //   slug: "scholarswipe",
  //   title: "ScholarSwipe",
  //   description: "Educational match-maker connecting university students with qualified research grants and scholarships.",
  //   longDescription: "A swipe-optimized discovery engine designed for academic financing. Features localized local-storage persistence state controls to capture swipe telemetry, complete with detailed highlight overlays and accessible high-contrast navigation guides.",
  //   stack: ["React", "TypeScript", "Tailwind CSS", "motion.dev", "Figma"],
  //   type: "MVP Platform",
  //   status: "COMPLETE",
  //   role: "UI Designer & Developer",
  //   year: "2024",
  //   category: "featured",
  //   isFeatured: true,
  //   showOnHome: true,
  //   githubUrl: "https://github.com/byteprowler/scholarswipe",
  //   githubOwner: "byteprowler",
  //   githubRepo: "scholarswipe",
  //   useGithubMetadata: true,
  //   liveUrl: "https://scholarswipe.edu",
  //   repoVisibility: "public",
  //   highlights: [
  //     "Pioneered responsive touch-canvas gestures with physics inertia fallback for standard browsers.",
  //     "Maintained full conformance to WAI-ARIA WCAG level AA accessibility standards for form nodes.",
  //     "Engineered automated client caching loops reducing server query fetches on match listings.",
  //   ],
  // },
  {
    slug: "de-clothing",
    title: "DE Clothing",
    description:
      "A modern e-commerce storefront designed for clothing and fashion products, focusing on product discovery, clean layouts, and an engaging online shopping experience.",
    longDescription:
      "DE Clothing is an e-commerce frontend project focused on creating a modern digital storefront for fashion products. The project explores the core elements of an online shopping experience, including product presentation, category browsing, responsive layouts, and visually engaging user interfaces. Built with modern frontend technologies, the platform focuses on creating a smooth browsing experience while maintaining reusable components, clean architecture, and a design system suitable for future commerce features.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "motion.dev", "Figma"],
    type: "Fashion E-commerce Platform",
    status: "PROTOTYPE",
    role: "Frontend Developer",
    year: "2024",
    category: "featured",
    isFeatured: true,
    showOnHome: true,
    githubUrl: "https://github.com/byteprowler/DE-Clothing",
    githubOwner: "byteprowler",
    githubRepo: "DE-Clothing",
    useGithubMetadata: true,
    liveUrl: "https://de-clothing.vercel.app",
    repoVisibility: "public",
    highlights: [
      "Designed a fashion-focused storefront experience with emphasis on product visibility and user exploration.",
      "Created reusable UI components for product displays and shopping-related sections.",
      "Implemented responsive layouts to provide a consistent experience across devices.",
      "Focused on visual hierarchy, spacing, and typography to create a premium brand presentation.",
      "Structured the frontend architecture to support future e-commerce functionality and expansion."
    ],
  },
  // {
  //   slug: "mently-ui-improvements",
  //   title: "Mently UI Refactor",
  //   description: "Professional design and interface optimization overhaul of the leading mental wellness scheduling web-app.",
  //   longDescription: "A focused interface modernization project targeting user retention, navigation clarity, and visual aesthetics of a digital wellness scheduling network. Rewrote legacy table matrices into reactive grids, streamlining user entry funnels.",
  //   stack: ["TypeScript", "React", "CSS Modules", "Vite", "Figma"],
  //   type: "Client Refactor",
  //   status: "COMPLETE",
  //   role: "Frontend UI Consultant",
  //   year: "2024",
  //   category: "client",
  //   showOnHome: true,
  //   repoVisibility: "private",
  //   highlights: [
  //     "Increased user booking completion rates by 18% through simplified timezone visual selector rails.",
  //     "Architected clean custom-styled scheduling grid component with modular styling properties.",
  //     "Implemented responsive calendar drawers and slide-outs utilizing lightweight entrance transitions.",
  //   ],
  // },
  {
    slug: "jlpowertools",
    title: "JL PowerTools",
    description:
      "A professional business website built for J & L Powertools LTD, a Lagos-based supplier of industrial ladders, scaffolding, and power tools, designed to improve online visibility and help customers discover their products and services.",
    longDescription:
      "A business-focused website developed to establish a stronger digital presence for J & L Powertools LTD, a supplier of industrial ladders, scaffolding systems, and power tools in Lagos, Nigeria. The project focused on transforming a traditional business offering into an accessible online experience through structured product information, clear navigation, responsive layouts, and a professional brand presentation. The website was designed to help potential customers understand available solutions, explore offerings, and easily connect with the business across different devices.",
    stack: ["TypeScript", "React", "CSS Modules", "Next.js"],
    type: "Business Website",
    status: "COMPLETE",
    role: "Frontend Developer",
    year: "2025",
    category: "client",
    isFeatured: true,
    showOnHome: true,
    githubOwner: "byteprowler",
    githubRepo: "https://github.com/byteprowler/jlpowertools",
    useGithubMetadata: true,
    preferGithubDescription: true,
    liveUrl: "https://jlpowertools.biz",
    repoVisibility: "private",
    highlights: [
      "Built a responsive business website optimized for desktop and mobile users.",
      "Created structured sections to improve product discovery and customer navigation.",
      "Designed a professional digital presence for an industrial tools and equipment supplier.",
      "Focused on clear information hierarchy to communicate products and services effectively.",
      "Implemented modern frontend practices to improve usability, maintainability, and performance."
    ],
  },
  // {
  //   slug: "anime-discovery-interface",
  //   title: "Anime Discovery Hub",
  //   description: "Immersive media library viewer connecting directly to AniList's schema to explore top titles.",
  //   longDescription: "An immersive entertainment portal fetching live data from third-party GraphQL services. Handled complex list search terms, infinite pagination scroll listeners, and dynamic title cards supporting elegant visual previews.",
  //   stack: ["React", "TypeScript", "Tailwind CSS", "GraphQL", "motion.dev"],
  //   type: "Web Application",
  //   status: "ACTIVE_DEV",
  //   role: "Front-End Lead",
  //   year: "2025",
  //   category: "fun",
  //   showOnHome: true,
  //   githubUrl: "https://github.com/byteprowler/anime-hub",
  //   githubOwner: "byteprowler",
  //   githubRepo: "anime-hub",
  //   useGithubMetadata: true,
  //   repoVisibility: "public",
  //   highlights: [
  //     "Designed dynamic card hover overlays styled with custom neon glowing borders.",
  //     "Engineered smart debounce query listeners on client input nodes preventing API rate threshold blocks.",
  //     "Optimized graphic payload delivery with reactive image loading states.",
  //   ],
  // },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
