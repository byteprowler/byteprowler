import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Cpu, Globe, Terminal } from "lucide-react";
import { techStack, TechItem } from "../../lib/content/techStack";
import TechCard from "../ui/TechCard";
import TechDetailModal from "../ui/TechDetailModal";

export default function TechArsenal() {
  // Show only 6-8 important technologies from current/core stack only
  const corePreviewTech = techStack
    .filter((tech) => tech.status === "CORE")
    .slice(0, 8);

  const [selectedTech, setSelectedTech] = useState<TechItem | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("NODE_001");

  const handleCardClick = (tech: TechItem, nodeId: string) => {
    setSelectedTech(tech);
    setSelectedNodeId(nodeId);
  };

  return (
    <section id="tech" className="py-12 md:py-24 border-t border-neon-lime/5 scroll-mt-20">
      {/* Section Indicator HUD Header */}
      <div className="flex items-center gap-2 mb-8 font-mono text-xs text-gray-400">
        <span className="text-neon-lime font-mono">[03]</span>
        <span className="tracking-widest font-semibold uppercase">TECH_ARSENAL_MODULE</span>
        <div className="grow h-px bg-neon-lime/10"></div>
        <span className="text-[10px] text-neon-lime/40 uppercase">CORE_SYSTEMS_PREVIEW</span>
      </div>

      <div className="flex flex-col gap-6">
        {/* Terminal Section Header and CTA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neon-lime">
              <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
              <span>[SYSTEM_CHECK] ACTIVE CORE STACK</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight uppercase font-sans tracking-tight">
              Core Tech Arsenal
            </h2>
            <p className="text-sm font-mono text-gray-400 max-w-2xl">
              Foundational languages, frameworks, and build tooling powering active Byteprowler production deployments.
            </p>
          </div>

          <Link
            href="/tech-arsenal"
            className="terminal-button inline-flex min-h-11 items-center justify-center gap-2 border border-neon-lime/40 bg-neon-lime px-4 py-2 font-mono text-xs font-black uppercase tracking-widest text-black transition hover:bg-[#bbf000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-lime focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
          >
            <span>ACCESS FULL ARSENAL</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Compact Tech Grid (6-8 items) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {corePreviewTech.map((tech, index) => {
            const nodeId = tech.nodeId || `NODE_${String(index + 1).padStart(3, "0")}`;
            return (
              <TechCard
                key={tech.name}
                tech={tech}
                nodeId={nodeId}
                onClick={() => handleCardClick(tech, nodeId)}
              />
            );
          })}
        </div>

        {/* Legend & Navigation Banner */}
        <div className="border border-white/5 bg-black/40 p-4 sm:p-5 rounded-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-mono text-[11px] text-gray-400">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-neon-lime animate-pulse shrink-0" aria-hidden="true" />
            <span>
              SHOWING {corePreviewTech.length} CORE NODES · {techStack.length} TOTAL TECHNOLOGIES CATALOGED
            </span>
          </div>

          <Link
            href="/tech-arsenal"
            className="inline-flex items-center gap-1.5 text-neon-lime hover:underline font-bold tracking-wider uppercase text-xs"
          >
            <span>EXPLORE FULL DATABASE (FRAMEWORKS, BACKEND, SCRIPTS, TOOLS)</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Detail Inspection Modal */}
      <TechDetailModal
        tech={selectedTech}
        nodeId={selectedNodeId}
        isOpen={Boolean(selectedTech)}
        onClose={() => setSelectedTech(null)}
      />
    </section>
  );
}
