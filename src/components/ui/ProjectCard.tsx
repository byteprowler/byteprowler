import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Code2, ExternalLink, FolderClosed, Github, GitFork, Star } from "lucide-react";
import { Project } from "../../lib/projects";
import { fetchGithubRepoMetadata } from "../../lib/github";

interface ProjectCardProps {
    project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const isPublicRepo = project.repoVisibility === "public";
    const canFetchGithub =
        project.useGithubMetadata === true &&
        isPublicRepo &&
        Boolean(project.githubOwner) &&
        Boolean(project.githubRepo);
    const { data: githubSignal, isLoading: isGithubLoading } = useQuery({
        queryKey: ["githubRepo", project.githubOwner, project.githubRepo],
        queryFn: () => fetchGithubRepoMetadata(project.githubOwner || "", project.githubRepo || ""),
        enabled: canFetchGithub,
        staleTime: 1000 * 60 * 60,
    });
    const githubRepo = githubSignal?.repo;
    const githubHref = isPublicRepo ? githubRepo?.url || project.githubUrl : undefined;
    const statusColors = {
        COMPLETE: "bg-neon-green/10 text-neon-green border-neon-green/30",
        PROTOTYPE: "bg-neon-blue/10 text-neon-blue border-neon-blue/30",
        ACTIVE_DEV: "bg-neon-purple/10 text-neon-purple border-neon-purple/30",
    };

    return (
        <div
            className="border border-white/5 bg-black/60 backdrop-blur-sm rounded-sm p-5 flex flex-col justify-between h-auto hover:border-neon-lime/40 hover:bg-black/80 transition-all duration-300 group shadow-md hover:shadow-glow-lime/5 cursor-default relative overflow-hidden transform hover:-translate-y-1 motion-reduce:transform-none motion-reduce:hover:translate-y-0"
        >
            {/* Decorative vertical line accent in the background */}
            <div className="absolute top-0 right-0 w-[2px] h-0 bg-neon-lime group-hover:h-full transition-all duration-500"></div>

            <div>
                {/* Card Header stats-bar */}
                <div className="flex justify-between items-center text-[11px] font-mono text-gray-300 border-b border-white/5 pb-3 mb-4 select-none">
                    <span className="flex items-center gap-1.5 uppercase font-mono tracking-wider">
                        <FolderClosed className="w-3.5 h-3.5 text-neon-lime" />
                        {project.type}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-300 font-mono">{`// ${project.year}`}</span>
                        {project.currentVersion && (
                            <span className="text-[11px] font-black tracking-widest px-1.5 py-0.5 rounded-xs border border-neon-blue/20 bg-neon-blue/5 text-neon-blue uppercase">
                                {`VERSION: ${project.currentVersion}`}
                            </span>
                        )}
                        <span className={`text-[11px] font-black tracking-widest px-1.5 py-0.5 rounded-xs border uppercase ${statusColors[project.status]}`}>
                            {project.status === "ACTIVE_DEV" ? "ACTIVE" : project.status}
                        </span>
                    </div>
                </div>

                {/* Project Title */}
                <h3 className="text-xl font-bold text-white tracking-tight leading-snug group-hover:text-neon-lime transition-all duration-300 uppercase font-sans">
                    {project.title}
                </h3>

                {/* Project Short Description */}
                <p className="text-gray-200 text-sm leading-relaxed mt-2.5 font-sans">
                    {project.description}
                </p>

                {/* Tech Stack Badges */}
                <div className="flex flex-wrap gap-1.5 mt-5">
                    {project.stack.slice(0, 4).map((tech) => (
                        <span
                            key={tech}
                            className="text-[11px] font-mono font-semibold tracking-wider text-neon-blue bg-neon-blue/5 border border-neon-blue/10 px-2 py-0.5 rounded-sm"
                        >
                            {tech}
                        </span>
                    ))}
                    {project.stack.length > 4 && (
                        <span className="text-[11px] font-mono text-gray-300 px-1 py-0.5">
                            +{project.stack.length - 4} MORE
                        </span>
                    )}
                </div>

                <div className="mt-4 rounded-sm border border-white/5 bg-black/35 px-3 py-2 font-mono text-[10.5px] uppercase tracking-wider text-gray-300">
                    {canFetchGithub ? (
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="font-black text-neon-blue">
                                GITHUB_SIGNAL: {isGithubLoading ? "SYNCING" : githubSignal?.ok ? "ONLINE" : "OFFLINE"}
                            </span>
                            {githubRepo?.stars !== undefined && (
                                <span className="inline-flex items-center gap-1">
                                    <Star className="h-3 w-3 text-neon-lime" aria-hidden="true" />
                                    STARS: {githubRepo.stars}
                                </span>
                            )}
                            {githubRepo?.forks !== undefined && (
                                <span className="inline-flex items-center gap-1">
                                    <GitFork className="h-3 w-3 text-neon-purple" aria-hidden="true" />
                                    FORKS: {githubRepo.forks}
                                </span>
                            )}
                            {githubRepo?.language && (
                                <span className="inline-flex items-center gap-1 text-gray-200">
                                    <Code2 className="h-3 w-3 text-neon-blue" aria-hidden="true" />
                                    {githubRepo.language}
                                </span>
                            )}
                        </div>
                    ) : (
                        <span className={project.repoVisibility === "private" ? "font-black text-neon-purple" : "font-black text-gray-400"}>
                            SOURCE: {project.repoVisibility === "private" ? "PRIVATE" : "UNAVAILABLE"}
                        </span>
                    )}
                </div>
            </div>

            {/* Footer Interface Actions */}
            <div className="border-t border-white/5 pt-4 mt-6 flex justify-between items-center gap-4">
                {/* Core Case Study Router Action */}
                <Link
                    href={`/projects/${project.slug}`}
                    aria-label={`View ${project.title} case study`}
                    className="text-xs font-mono font-bold text-neon-lime hover:text-white flex items-center gap-1 group/btn transition-colors duration-200 cursor-pointer"
                >
                    <span>VIEW CASE STUDY</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neon-lime group-hover/btn:text-white transition-colors duration-200" />
                </Link>

                {/* Outer Links (Optional) */}
                <div className="flex items-center gap-3">
                    {githubHref && (
                        <a
                            href={githubHref}
                            target="_blank"
                            referrerPolicy="no-referrer"
                            rel="noopener noreferrer"
                            title="View Repository On GitHub"
                            aria-label={`View ${project.title} repository on GitHub`}
                            className="text-gray-300 hover:text-neon-blue transition-colors duration-200"
                        >
                            <Github className="w-4 h-4" />
                            <span className="sr-only">View GitHub repository</span>
                        </a>
                    )}
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            referrerPolicy="no-referrer"
                            rel="noopener noreferrer"
                            title="Launch Application Node"
                            aria-label={`Launch ${project.title} live project`}
                            className="text-gray-300 hover:text-neon-green transition-colors duration-200"
                        >
                            <ExternalLink className="w-4 h-4" />
                            <span className="sr-only">Launch live project</span>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
