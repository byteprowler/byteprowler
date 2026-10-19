import React from "react";
import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Github, ExternalLink, Calendar, User, Shield, CheckCircle, Flame, Code2, GitFork, Star } from "lucide-react";
import { getProjectBySlug, projects } from "../../lib/projects";
import { fetchGithubRepoMetadata } from "../../lib/github";
import Layout from "../../components/layout/Layout";
import SEO from "../../components/seo/SEO";
import { canonicalUrl, absoluteImage } from "../../lib/site";

interface ProjectDetailProps {
  slug?: string;
  onBack?: () => void; // Support fallback back trigger
}

export default function ProjectDetail({ slug, onBack }: ProjectDetailProps) {
  const currentSlug = slug ?? (
    typeof window === "undefined"
      ? undefined
      : window.location.pathname.match(/\/projects\/([^/]+)/)?.[1]
  );

  const project = currentSlug ? getProjectBySlug(currentSlug) : undefined;
  const canFetchGithub =
    project?.useGithubMetadata === true &&
    project.repoVisibility === "public" &&
    Boolean(project.githubOwner) &&
    Boolean(project.githubRepo);
  const { data: githubSignal, isLoading: isGithubLoading } = useQuery({
    queryKey: ["githubRepo", project?.githubOwner, project?.githubRepo],
    queryFn: () => fetchGithubRepoMetadata(project?.githubOwner || "", project?.githubRepo || ""),
    enabled: canFetchGithub,
    staleTime: 1000 * 60 * 60,
  });
  const githubRepo = githubSignal?.repo;
  const githubHref = project?.repoVisibility === "public" ? githubRepo?.url || project.githubUrl : undefined;

  // Handle standard dynamic fallback search / 404
  if (!project) {
    return (
      <Layout>
        <div className="py-24 max-w-2xl mx-auto text-center flex flex-col items-center gap-6 select-none animate-flicker">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 text-2xl font-mono font-black animate-pulse">
            !
          </div>
          <div className="flex flex-col gap-2 font-mono">
            <h2 className="text-xl font-black text-white uppercase tracking-widest">
              [SYSTEM_404_NOT_FOUND]
            </h2>
            <p className="text-sm text-gray-300 uppercase leading-relaxed">
              {`Decryption failure. The requested project slug "${currentSlug || "NULL"}" is not stored in local telemetry.`}
            </p>
          </div>
          <button
            onClick={() => {
              if (onBack) {
                onBack();
              } else if (typeof window !== "undefined") {
                window.location.href = "/";
              }
            }}
            className="px-5 py-2.5 bg-black border border-neon-lime/30 hover:border-neon-lime text-neon-lime font-mono text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-2 duration-300 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN_TO_HOME_GRID</span>
          </button>
        </div>
      </Layout>
    );
  }

  const statusLabels = {
    COMPLETE: "PRODUCTION_STEADY",
    PROTOTYPE: "SANDBOX_VERIFIED",
    ACTIVE_DEV: "INTEGRATION_LOOP"
  };
  const seoDescription =
    project.description || project.longDescription || "A Byteprowler project case study.";
  const seoImage = project.ogImage || "/og-byteprowler.jpg";
  const seoUrl = `/projects/${project.slug}`;

  return (
    <>
      <SEO
        title={`${project.title} | Byteprowler Project Log`}
        description={seoDescription}
        image={seoImage}
        url={seoUrl}
        type="article"
        structuredData={{ "@context": "https://schema.org", "@graph": [
          { "@type": "CreativeWork", name: project.title, description: seoDescription, url: canonicalUrl(seoUrl), image: absoluteImage(seoImage) },
          { "@type": "BreadcrumbList", itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
            { "@type": "ListItem", position: 2, name: "Projects", item: canonicalUrl("/projects") },
            { "@type": "ListItem", position: 3, name: project.title, item: canonicalUrl(seoUrl) },
          ] },
        ] }}
      />
      <Layout>
        <div className="py-6 flex flex-col gap-8 select-none">
        
        {/* Dynamic Navigation back bar */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 select-none">
          <Link
            href="/projects"
            className="flex items-center gap-2 font-mono text-xs text-neon-lime font-bold hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK_TO_PROJECT_ARCHIVE</span>
          </Link>
          <div className="text-[11px] text-gray-300 font-mono tracking-widest uppercase">
            {"// SYS_RECOVERY_NODE_STUDY"}
          </div>
        </div>

        {/* Project Context Hero Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
          
          {/* LEFT: Project core content specifications */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            <div className="flex flex-col gap-3">
              <div className="text-[11px] font-mono text-neon-blue font-bold tracking-widest bg-neon-blue/10 border border-neon-blue/20 px-2.5 py-0.5 rounded-sm w-fit uppercase">
                [{project.type}]
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white leading-none tracking-tight uppercase font-sans">
                {project.title}
              </h1>
              <p className="text-gray-300 text-base leading-relaxed mt-2 font-sans border-l-2 border-neon-lime/30 pl-4">
                {project.description}
              </p>
            </div>

            {/* Dynamic detailed narrative segment */}
            <div className="border border-white/5 bg-black/50 p-6 rounded-sm flex flex-col gap-4">
              <span className="text-[11px] font-mono font-bold text-gray-300 uppercase tracking-widest border-b border-white/5 pb-2">
                [01] SYSTEM_NARRATIVE_LOGS
              </span>
              <p className="text-gray-200 text-sm leading-relaxed font-sans">
                {project.longDescription}
              </p>
            </div>

            {/* Highlights Lists */}
            <div className="border border-white/5 bg-black/55 p-6 rounded-sm flex flex-col gap-4">
              <span className="text-[11px] font-mono font-bold text-gray-300 uppercase tracking-widest border-b border-white/5 pb-2">
                [02] KEY_INTEGRITY_HIGHLIGHTS
              </span>
              <ul className="flex flex-col gap-3.5 font-sans">
                {project.highlights.map((hlt, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-gray-300 font-sans">
                    <CheckCircle className="w-5 h-5 text-neon-lime flex-shrink-0 mt-0.5" />
                    <span>{hlt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {project.versions && project.versions.length > 0 && (
              <div className="border border-white/5 bg-black/50 p-6 rounded-sm flex flex-col gap-4">
                <span className="text-[11px] font-mono font-bold text-gray-300 uppercase tracking-widest border-b border-white/5 pb-2">
                  [03] VERSION_HISTORY
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.versions.map((version) => (
                    <div
                      key={version.label}
                      className="border border-white/5 bg-[#08090d]/70 p-4 rounded-sm flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between gap-3 font-mono text-[11px] uppercase">
                        <span className="text-neon-blue font-black tracking-widest">
                          {version.host ? `${version.label} — ${version.host}` : version.label}
                        </span>
                        <span className="rounded-sm border border-white/10 bg-black/40 px-2 py-0.5 text-gray-300">
                          {version.status}
                        </span>
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-tight text-white">
                        {version.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-300">
                        {version.description}
                      </p>
                      {version.liveUrl && (
                        <a
                          href={version.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          referrerPolicy="no-referrer"
                          aria-label={`View ${version.label}${version.host ? ` on ${version.host}` : ""} Portfolio`}
                          className="mt-2 inline-flex min-h-10 items-center justify-center rounded-sm border border-neon-blue/20 bg-neon-blue/5 px-3 py-2 font-mono text-[11px] font-black uppercase tracking-wider text-neon-blue transition hover:border-neon-blue/40 hover:bg-neon-blue/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
                        >
                          {`View ${version.label} Portfolio`}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT: High-integrity technical dashboard panel */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            <div className="border border-neon-lime/15 bg-black/75 rounded-sm p-4 w-full flex flex-col gap-5 neon-border-lime shadow-lg">
              
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[11px] text-neon-lime font-mono font-bold tracking-wider uppercase flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-neon-lime animate-pulse" />
                  SPECIFICATIONS
                </span>
                <span className="text-[11px] text-gray-300 font-mono">NODE_SPEC</span>
              </div>

              {/* Status specifications list */}
              <div className="flex flex-col gap-3 font-mono text-xs">
                
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-gray-300 font-bold uppercase flex items-center gap-1.5 font-mono">
                    <Calendar className="w-3.5 h-3.5" /> YEAR
                  </span>
                  <span className="text-white font-bold">{project.year}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-gray-300 font-bold uppercase flex items-center gap-1.5 font-mono">
                    <User className="w-3.5 h-3.5" /> ROLE
                  </span>
                  <span className="text-neon-blue font-bold">{project.role}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="text-gray-300 font-bold uppercase flex items-center gap-1.5 font-mono">
                    <Shield className="w-3.5 h-3.5" /> STATUS
                  </span>
                  <span className="text-neon-green font-bold text-[11px] bg-neon-green/5 border border-neon-green/20 px-2 py-0.5 rounded-sm">
                    {statusLabels[project.status]}
                  </span>
                </div>

                <div className="flex justify-between items-center gap-3 py-1.5 border-b border-white/5">
                  <span className="text-gray-300 font-bold uppercase flex items-center gap-1.5 font-mono">
                    <Github className="w-3.5 h-3.5" /> SOURCE
                  </span>
                  <span className={`font-bold text-[11px] uppercase ${project.repoVisibility === "public" ? "text-neon-blue" : project.repoVisibility === "private" ? "text-neon-purple" : "text-gray-300"}`}>
                    {project.repoVisibility === "public" ? "PUBLIC" : project.repoVisibility === "private" ? "PRIVATE" : "UNAVAILABLE"}
                  </span>
                </div>

              </div>

              <div className="rounded-sm border border-white/5 bg-black/35 p-3 font-mono text-[11px] uppercase tracking-wider text-gray-300">
                <div className="mb-2 font-black text-neon-blue">REPOSITORY_SIGNAL</div>
                {canFetchGithub ? (
                  <div className="flex flex-col gap-2">
                    <span className={githubSignal?.ok ? "font-black text-neon-green" : "font-black text-neon-purple"}>
                      GITHUB_SIGNAL: {isGithubLoading ? "SYNCING" : githubSignal?.ok ? "ONLINE" : "OFFLINE"}
                    </span>
                    {githubRepo && (
                      <>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                          <span className="inline-flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 text-neon-lime" aria-hidden="true" />
                            STARS: {githubRepo.stars ?? 0}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <GitFork className="h-3.5 w-3.5 text-neon-purple" aria-hidden="true" />
                            FORKS: {githubRepo.forks ?? 0}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Code2 className="h-3.5 w-3.5 text-neon-blue" aria-hidden="true" />
                            {githubRepo.language || "LANG_UNKNOWN"}
                          </span>
                        </div>
                        {githubRepo.topics && githubRepo.topics.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {githubRepo.topics.map((topic) => (
                              <span key={topic} className="rounded-sm border border-white/10 bg-white/3 px-1.5 py-0.5 text-[10px] text-gray-300">
                                #{topic}
                              </span>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <span className={project.repoVisibility === "private" ? "font-black text-neon-purple" : "font-black text-gray-400"}>
                    {project.repoVisibility === "private" ? "SOURCE: PRIVATE" : "SOURCE: UNAVAILABLE"}
                  </span>
                )}
              </div>

              {/* Tech Stack specs list */}
              <div className="flex flex-col gap-2 mt-2">
                <span className="text-[11px] font-mono text-gray-300 uppercase font-bold tracking-wider">
                  SYSTEM_INTELLIGENCE_STACK
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10.5px] font-mono font-black text-neon-purple bg-neon-purple/5 border border-neon-purple/20 px-2 py-1 rounded-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons list */}
              <div className="flex flex-col gap-2 mt-4">
                {githubHref && (
                  <a
                    href={githubHref}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-black hover:bg-neon-blue/10 border border-neon-blue/30 text-neon-blue font-mono text-center text-xs font-bold uppercase rounded-sm flex items-center justify-center gap-2 transition-all duration-300"
                  >
                    <Github className="w-4 h-4" />
                    <span>SOURCE_TELEMETRY</span>
                  </a>
                )}
                
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-neon-lime hover:bg-[#bbf000] text-black font-mono text-center text-xs font-bold uppercase rounded-sm flex items-center justify-center gap-2 transition-all duration-300 border border-transparent shadow-sm hover:shadow-glow-lime/10"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>LAUNCH_ACTIVE_NODE</span>
                  </a>
                )}
              </div>

            </div>

          </div>

        </div>

        </div>
      </Layout>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = () => ({
  paths: projects.map((project) => ({
    params: { slug: project.slug },
  })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<ProjectDetailProps> = ({ params }) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";
  if (!getProjectBySlug(slug)) return { notFound: true };
  return { props: { slug } };
};
