import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Filter, FolderClosed } from "lucide-react";
import Layout from "../../components/layout/Layout";
import SEO from "../../components/seo/SEO";
import ProjectCard from "../../components/ui/ProjectCard";
import { projects, type Project } from "../../lib/projects";

type ArchiveFilter =
  | "ALL"
  | "FEATURED"
  | "CLIENT"
  | "FREELANCE"
  | "LEARNING"
  | "FUN"
  | "LAB"
  | "FORK"
  | "FRONTEND"
  | "FULLSTACK";

const filters: ArchiveFilter[] = [
  "ALL",
  "FEATURED",
  "CLIENT",
  "FREELANCE",
  "LEARNING",
  "FUN",
  "LAB",
  "FORK",
  "FRONTEND",
  "FULLSTACK",
];

function projectMatchesFilter(project: Project, filter: ArchiveFilter) {
  const category = project.category?.toUpperCase();
  const searchable = [project.type, project.role, ...project.stack].join(" ").toUpperCase();

  if (filter === "ALL") return true;
  if (filter === "FEATURED") return project.isFeatured === true;
  if (filter === "FRONTEND") return searchable.includes("FRONTEND") || searchable.includes("REACT");
  if (filter === "FULLSTACK") {
    return ["FULLSTACK", "BACKEND", "NODE", "EXPRESS", "POSTGRES", "SUPABASE", "SQL", "API"].some((term) =>
      searchable.includes(term),
    );
  }
  return category === filter;
}

export default function ProjectArchivePage() {
  const [activeFilter, setActiveFilter] = useState<ArchiveFilter>("ALL");
  const filteredProjects = useMemo(
    () => projects.filter((project) => projectMatchesFilter(project, activeFilter)),
    [activeFilter],
  );

  return (
    <>
      <SEO
        title="Project Archive | Byteprowler"
        description="Full Byteprowler project archive covering featured builds, client work, learning projects, labs, and side experiments."
        url="/projects"
        image="/og-byteprowler.jpg"
      />

      <Layout>
        <section className="py-10 md:py-16">
          <div className="mb-8 flex flex-col gap-4 border-b border-white/5 pb-6">
            <Link
              href="/#projects"
              className="inline-flex w-fit items-center gap-2 rounded-sm border border-white/10 bg-black/45 px-3 py-2 font-mono text-[11px] font-black uppercase tracking-widest text-neon-lime transition hover:border-neon-lime/40 hover:bg-neon-lime/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-lime focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              BACK_TO_HOME_GRID
            </Link>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gray-400">
                <FolderClosed className="h-4 w-4 text-neon-blue" aria-hidden="true" />
                <span className="font-black text-neon-blue">PROJECT_ARCHIVE // FULL_LOG_ACCESS</span>
              </div>
              <h1 className="text-3xl font-black uppercase leading-tight text-white sm:text-5xl">
                Project Archive
              </h1>
              <p className="max-w-3xl text-sm leading-relaxed text-gray-300 sm:text-base">
                Full project registry including featured portfolio work, client-facing builds, learning logs,
                lab prototypes, and just-for-fun experiments.
              </p>
            </div>
          </div>

          <div className="mb-8 rounded-sm border border-neon-blue/15 bg-black/55 p-4">
            <div className="mb-3 flex items-center gap-2 font-mono text-[11px] font-black uppercase tracking-widest text-neon-blue">
              <Filter className="h-3.5 w-3.5" aria-hidden="true" />
              ARCHIVE_FILTERS
            </div>
            <div role="group" aria-label="Project archive filters" className="flex flex-wrap gap-2">
              {filters.map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveFilter(filter)}
                    className={`min-h-10 rounded-sm border px-3 py-2 font-mono text-[10.5px] font-black uppercase tracking-widest transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-lime focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian ${
                      isActive
                        ? "border-neon-lime bg-neon-lime text-black"
                        : "border-white/10 bg-black/50 text-gray-300 hover:border-neon-blue/40 hover:text-neon-blue"
                    }`}
                  >
                    {filter}
                    {isActive ? " [ACTIVE]" : ""}
                  </button>
                );
              })}
            </div>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          ) : (
            <div className="rounded-sm border border-white/10 bg-white/3 p-6 font-mono text-sm font-bold uppercase text-gray-300">
              NO_PROJECTS_MATCH_FILTER
            </div>
          )}
        </section>
      </Layout>
    </>
  );
}
