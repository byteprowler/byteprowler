import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  Cpu,
  Filter,
  RefreshCw,
  Search,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";
import Layout from "../components/layout/Layout";
import SEO from "../components/seo/SEO";
import TechCard from "../components/ui/TechCard";
import TechDetailModal from "../components/ui/TechDetailModal";
import {
  techCategories,
  techStack,
  isCategoryMatch,
  normalizeCategory,
  type TechCategoryId,
  type TechItem,
  type TechStatus,
} from "../lib/content/techStack";

export default function TechArsenalPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<TechCategoryId>("ALL_SYSTEMS");
  const [selectedStatus, setSelectedStatus] = useState<"ALL" | TechStatus>("ALL");
  const [selectedTech, setSelectedTech] = useState<TechItem | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("NODE_001");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Global keyboard shortcut to focus search with '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filtered tech stack calculation
  const filteredTech = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return techStack.filter((tech) => {
      // Category match
      const matchesCategory = isCategoryMatch(tech.category, activeCategory);

      // Status match
      const matchesStatus = selectedStatus === "ALL" || tech.status === selectedStatus;

      // Text search match across name, description, category, status, and highlights
      const searchBlob = [
        tech.name,
        tech.description ?? "",
        normalizeCategory(tech.category),
        tech.status,
        tech.nodeId ?? "",
        ...(tech.highlights ?? []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !normalizedQuery || searchBlob.includes(normalizedQuery);

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [activeCategory, query, selectedStatus]);

  // Compute item counts for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL_SYSTEMS: techStack.length,
    };

    for (const cat of techCategories) {
      if (cat.id === "ALL_SYSTEMS") continue;
      counts[cat.id] = techStack.filter((tech) => isCategoryMatch(tech.category, cat.id)).length;
    }

    return counts;
  }, []);

  const handleCardClick = useCallback((tech: TechItem, nodeId: string) => {
    setSelectedTech(tech);
    setSelectedNodeId(nodeId);
  }, []);

  const handleResetFilters = useCallback(() => {
    setQuery("");
    setActiveCategory("ALL_SYSTEMS");
    setSelectedStatus("ALL");
  }, []);

  return (
    <>
      <SEO
        title="Tech Arsenal | Byteprowler Database"
        description="Search the complete Byteprowler technology database, including frontend core, frameworks, styling, backend systems, and development workflow."
        url="PASTE_CANONICAL_URL_HERE/tech-arsenal"
        image="/og-byteprowler.png"
      />

      <Layout>
        <div className="py-8 md:py-14 min-h-screen">
          {/* Top Breadcrumb & Terminal HUD */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4 font-mono text-xs uppercase tracking-wider text-gray-400">
            <Link
              href="/#tech"
              className="inline-flex min-h-10 items-center gap-2 rounded-xs border border-white/10 bg-black/50 px-3 py-2 text-neon-lime transition hover:border-neon-lime hover:bg-neon-lime/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-lime"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>RETURN_TO_HOMEPAGE_PREVIEW</span>
            </Link>

            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-gray-400">HOST: BYTEPROWLER_KERNEL</span>
              <span className="flex items-center gap-1.5 text-neon-lime font-bold">
                <span className="h-2 w-2 rounded-full bg-neon-lime animate-pulse" aria-hidden="true" />
                SYSTEM STATUS: ONLINE
              </span>
            </div>
          </div>

          {/* Terminal-Inspired Page Header */}
          <header className="mb-8 rounded-xs border border-neon-lime/20 bg-black/60 p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 h-full w-1/3 bg-radial from-neon-lime/5 via-transparent to-transparent pointer-events-none" />

            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neon-lime mb-2">
              <Terminal className="h-4 w-4" aria-hidden="true" />
              <span>BYTEPROWLER // TECH_DATABASE // ROOT_ACCESS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-sans">
              Tech Arsenal
            </h1>

            <p className="mt-2 max-w-3xl text-sm sm:text-base leading-relaxed text-gray-300 font-sans">
              Comprehensive telemetry and architecture manifest for every language, framework, database, and pipeline tool integrated into the Byteprowler ecosystem.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4 pt-4 border-t border-white/10 font-mono text-xs uppercase tracking-wider text-gray-400">
              <div>
                <span className="text-gray-400">TOTAL NODES: </span>
                <span className="font-bold text-white">{techStack.length}</span>
              </div>
              <span className="text-white/20">|</span>
              <div>
                <span className="text-gray-400">CORE ARCHITECTURE: </span>
                <span className="font-bold text-neon-lime">
                  {techStack.filter((t) => t.status === "CORE").length} NODES
                </span>
              </div>
              <span className="text-white/20">|</span>
              <div>
                <span className="text-gray-400">ACTIVE DEPLOYMENTS: </span>
                <span className="font-bold text-neon-blue">
                  {techStack.filter((t) => t.status === "ACTIVE").length} NODES
                </span>
              </div>
              <span className="text-white/20">|</span>
              <div>
                <span className="text-gray-400">GROWTH VECTORS: </span>
                <span className="font-bold text-neon-purple">
                  {techStack.filter((t) => t.status === "LEARNING").length} NODES
                </span>
              </div>
            </div>
          </header>

          {/* Search and Filters Control Panel */}
          <section aria-labelledby="arsenal-controls-title" className="mb-8 rounded-xs border border-white/10 bg-[#07080c] p-4 sm:p-6 space-y-5">
            <h2 id="arsenal-controls-title" className="sr-only">
              Technology Search and Category Filters
            </h2>

            {/* Search Input Bar */}
            <div className="relative">
              <label
                htmlFor="tech-search-input"
                className="mb-2 flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-neon-blue"
              >
                <span className="flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>prwlr@db:~$ query --search</span>
                </span>
                <span className="hidden sm:inline font-mono text-[11px] text-gray-400">
                  PRESS <kbd className="rounded-2xs border border-white/20 bg-white/5 px-1.5 py-0.5 text-gray-300">/</kbd> TO FOCUS
                </span>
              </label>

              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neon-blue"
                  aria-hidden="true"
                />
                <input
                  ref={searchInputRef}
                  id="tech-search-input"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter by technology name, category, capabilities, or keyword..."
                  className="min-h-12 w-full rounded-xs border border-white/15 bg-black/80 py-2.5 pl-11 pr-10 font-mono text-sm text-white placeholder-gray-400 outline-none transition focus:border-neon-lime focus:ring-2 focus:ring-neon-lime/30"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search input"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-2xs p-1 text-gray-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-lime"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div>
              <div className="mb-2 flex items-center justify-between font-mono text-xs uppercase tracking-wider text-gray-400">
                <span className="font-bold text-gray-300">CATEGORY_FILTERS</span>
                <span className="text-[11px] text-gray-400">
                  {filteredTech.length} OF {techStack.length} MODULES DISPLAYED
                </span>
              </div>

              <div
                role="tablist"
                aria-label="Technology category filter tabs"
                className="flex flex-wrap gap-2"
              >
                {techCategories.map((category) => {
                  const isActive = activeCategory === category.id;
                  const count = categoryCounts[category.id] ?? 0;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveCategory(category.id)}
                      className={`inline-flex min-h-10 items-center gap-2 rounded-xs border px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-lime focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian ${
                        isActive
                          ? "border-neon-lime bg-neon-lime text-black shadow-[0_0_12px_rgba(197,255,0,0.3)]"
                          : "border-white/10 bg-black/60 text-gray-300 hover:border-neon-lime/40 hover:text-white"
                      }`}
                    >
                      <span>{category.label}</span>
                      <span
                        className={`rounded-2xs px-1.5 py-0.5 text-[10px] font-black ${
                          isActive ? "bg-black/20 text-black" : "bg-white/5 text-gray-400"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Secondary Status Filter Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
                <span className="uppercase text-gray-400">STATUS_FILTER:</span>
                <div className="flex gap-1.5">
                  {(["ALL", "CORE", "ACTIVE", "LEARNING"] as const).map((status) => {
                    const isStatusActive = selectedStatus === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setSelectedStatus(status)}
                        className={`rounded-2xs px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider transition ${
                          isStatusActive
                            ? "bg-white/20 text-white font-black"
                            : "text-gray-400 hover:text-gray-200"
                        }`}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>

              {(query || activeCategory !== "ALL_SYSTEMS" || selectedStatus !== "ALL") && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 text-neon-lime hover:underline text-xs uppercase font-bold"
                >
                  <RefreshCw className="h-3 w-3" aria-hidden="true" />
                  <span>RESET_ALL_FILTERS</span>
                </button>
              )}
            </div>
          </section>

          {/* Results Summary Bar */}
          <div
            className="mb-4 flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-wider text-gray-400"
            aria-live="polite"
          >
            <span>
              SYSTEM_MATCHES:{" "}
              <strong className="text-neon-lime font-bold">{filteredTech.length}</strong> NODES
            </span>
            <span className="hidden sm:inline text-gray-400">
              CLICK CARD TO INSPECT SPECIFICATIONS
            </span>
          </div>

          {/* Responsive Grid with Motion Animations */}
          {filteredTech.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredTech.map((tech, index) => {
                  const nodeId = tech.nodeId || `NODE_${String(index + 1).padStart(3, "0")}`;
                  return (
                    <motion.div
                      layout
                      key={tech.name}
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                      transition={{ duration: shouldReduceMotion ? 0.01 : 0.22 }}
                    >
                      <TechCard
                        tech={tech}
                        nodeId={nodeId}
                        onClick={() => handleCardClick(tech, nodeId)}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="rounded-xs border border-dashed border-white/15 bg-black/50 p-10 text-center font-mono space-y-3">
              <p className="text-neon-lime text-base font-bold uppercase tracking-wider">
                [SYSTEM_ALERT] NO_SYSTEMS_MATCH_QUERY
              </p>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                No technological modules matched &quot;{query}&quot; within category &quot;{activeCategory}&quot;.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 inline-flex items-center gap-2 rounded-xs border border-neon-lime/40 bg-neon-lime px-4 py-2 font-mono text-xs font-black uppercase text-black hover:bg-[#bbf000]"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                RESET_SYSTEM_QUERY
              </button>
            </div>
          )}
        </div>
      </Layout>

      {/* Tech Detail Inspection Modal */}
      <TechDetailModal
        tech={selectedTech}
        nodeId={selectedNodeId}
        isOpen={Boolean(selectedTech)}
        onClose={() => setSelectedTech(null)}
      />
    </>
  );
}
