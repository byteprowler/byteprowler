import React from "react";
import { Cpu, Database, Sparkles, Terminal } from "lucide-react";
import { TechItem, normalizeCategory } from "../../lib/content/techStack";

interface TechCardProps {
  tech: TechItem;
  nodeId: string;
  onClick: () => void;
}

const statusStyles: Record<TechItem["status"], { badge: string; dot: string; glow: string }> = {
  CORE: {
    badge: "border-neon-lime/40 bg-neon-lime/10 text-neon-lime shadow-[0_0_8px_rgba(197,255,0,0.15)]",
    dot: "bg-neon-lime shadow-[0_0_6px_#c5ff00]",
    glow: "group-hover:border-neon-lime/50 group-hover:shadow-[0_0_20px_rgba(197,255,0,0.12)]",
  },
  ACTIVE: {
    badge: "border-neon-blue/40 bg-neon-blue/10 text-neon-blue shadow-[0_0_8px_rgba(0,243,255,0.15)]",
    dot: "bg-neon-blue shadow-[0_0_6px_#00f3ff]",
    glow: "group-hover:border-neon-blue/50 group-hover:shadow-[0_0_20px_rgba(0,243,255,0.12)]",
  },
  LEARNING: {
    badge: "border-neon-purple/40 bg-neon-purple/10 text-neon-purple shadow-[0_0_8px_rgba(182,92,255,0.15)]",
    dot: "bg-neon-purple shadow-[0_0_6px_#b65cff]",
    glow: "group-hover:border-neon-purple/50 group-hover:shadow-[0_0_20px_rgba(182,92,255,0.12)]",
  },
};

export default function TechCard({ tech, nodeId, onClick }: TechCardProps) {
  const currentStatus = statusStyles[tech.status];
  const experienceYears = tech.experience ?? 1;
  const projectsCount = tech.projectsUsed ?? 0;
  const categoryCode = normalizeCategory(tech.category);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      aria-label={`Inspect ${tech.name} system specifications, status: ${tech.status}, node: ${nodeId}`}
      className={`group relative flex flex-col justify-between w-full min-h-[220px] rounded-xs border border-white/10 bg-[#07080c]/90 p-4 sm:p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:bg-[#0b0d14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-lime focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian motion-reduce:transform-none select-none cursor-pointer ${currentStatus.glow}`}
    >
      {/* Corner Bracket Decorators */}
      <span className="pointer-events-none absolute -top-px -left-px h-2 w-2 border-t-2 border-l-2 border-white/20 transition-colors group-hover:border-neon-lime" aria-hidden="true" />
      <span className="pointer-events-none absolute -bottom-px -right-px h-2 w-2 border-b-2 border-r-2 border-white/20 transition-colors group-hover:border-neon-lime" aria-hidden="true" />

      {/* Card Header: Node ID & Category */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-[11px] uppercase tracking-wider text-gray-400">
        <div className="flex items-center gap-1.5 text-gray-300">
          <Cpu className="h-3.5 w-3.5 text-neon-blue transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
          <span className="font-semibold text-gray-300 group-hover:text-neon-blue transition-colors">
            {categoryCode}
          </span>
        </div>
        <span className="font-bold text-gray-400 group-hover:text-gray-200 transition-colors">
          {nodeId}
        </span>
      </div>

      {/* Main Body: Name and Status */}
      <div className="py-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-sans text-xl sm:text-2xl font-black uppercase tracking-tight text-white transition-colors duration-200 group-hover:text-neon-lime">
            {tech.name}
          </h3>
          <span className={`inline-flex items-center gap-1.5 rounded-xs border px-2 py-0.5 font-mono text-[10px] font-black tracking-widest uppercase ${currentStatus.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${currentStatus.dot} animate-pulse`} aria-hidden="true" />
            {tech.status}
          </span>
        </div>

        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-gray-300 line-clamp-2">
          {tech.description}
        </p>
      </div>

      {/* Card Footer: Experience Indicator & Projects */}
      <div className="border-t border-white/5 pt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[10.5px] uppercase tracking-wider text-gray-400">
        {/* Experience Indicator Gauge */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400">EXP:</span>
          <div className="flex items-center gap-1" aria-label={`Experience level ${experienceYears} of 5`}>
            {Array.from({ length: 5 }, (_, index) => {
              const isFilled = index < experienceYears;
              return (
                <span
                  key={index}
                  className={`h-1.5 w-3 rounded-2xs transition-colors ${
                    isFilled ? `${currentStatus.dot} opacity-95` : "bg-white/10"
                  }`}
                  aria-hidden="true"
                />
              );
            })}
          </div>
          <span className="font-bold text-gray-300">
            {experienceYears === 1 ? "1 YR" : `${experienceYears} YRS`}
          </span>
        </div>

        {/* Projects count */}
        <div className="flex items-center gap-1 text-gray-400 group-hover:text-neon-lime transition-colors">
          <Database className="h-3 w-3 text-neon-lime" aria-hidden="true" />
          <span className="font-bold text-gray-300 group-hover:text-white">
            {projectsCount} {projectsCount === 1 ? "BUILD" : "BUILDS"}
          </span>
        </div>
      </div>
    </button>
  );
}
