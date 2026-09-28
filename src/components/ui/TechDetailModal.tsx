import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  ExternalLink,
  Shield,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";
import { TechItem, normalizeCategory } from "../../lib/content/techStack";

interface TechDetailModalProps {
  tech: TechItem | null;
  nodeId: string;
  isOpen: boolean;
  onClose: () => void;
}

const statusBadges: Record<TechItem["status"], { label: string; badge: string; desc: string }> = {
  CORE: {
    label: "PRODUCTION_CORE",
    badge: "border-neon-lime/40 bg-neon-lime/10 text-neon-lime shadow-[0_0_10px_rgba(197,255,0,0.2)]",
    desc: "Foundational architecture deployed across critical client and internal production systems.",
  },
  ACTIVE: {
    label: "DEPLOYMENT_ACTIVE",
    badge: "border-neon-blue/40 bg-neon-blue/10 text-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.2)]",
    desc: "Active operational stack with frequent production implementation and daily fluency.",
  },
  LEARNING: {
    label: "GROWTH_VECTOR",
    badge: "border-neon-purple/40 bg-neon-purple/10 text-neon-purple shadow-[0_0_10px_rgba(182,92,255,0.2)]",
    desc: "Exploratory stack undergoing active study, benchmarking, and architectural prototyping.",
  },
};

export default function TechDetailModal({
  tech,
  nodeId,
  isOpen,
  onClose,
}: TechDetailModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;

    // Save previous active element to restore focus on close
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Focus close button on mount
    closeButtonRef.current?.focus();

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Handle Escape and Tab key focus trap
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab" && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen || !tech) return null;

  const statusMeta = statusBadges[tech.status];
  const categoryCode = normalizeCategory(tech.category);
  const experienceYears = tech.experience ?? 1;
  const projectsCount = tech.projectsUsed ?? 0;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tech-modal-title"
          aria-describedby="tech-modal-desc"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: shouldReduceMotion ? 0.05 : 0.2, ease: "easeOut" }}
          className="relative w-full max-w-2xl rounded-sm border border-neon-lime/30 bg-[#090b10] shadow-[0_0_35px_rgba(0,0,0,0.9)] my-auto max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between border-b border-white/10 bg-black/80 px-4 py-3 select-none">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-neon-green/80" aria-hidden="true" />
              <span className="ml-2 font-mono text-[11px] font-bold text-gray-300">
                prwlr@db:~$ sys_inspect --node={nodeId}
              </span>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close technology inspection dialog"
              className="rounded-xs border border-white/10 p-1.5 text-gray-400 transition hover:border-neon-lime hover:bg-neon-lime/10 hover:text-neon-lime focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-lime"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Modal Scrollable Content */}
          <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
            {/* Header Block */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neon-blue">
                  <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>REGISTRY_RECORD // {nodeId}</span>
                </div>
                <h2
                  id="tech-modal-title"
                  className="mt-1 text-2xl sm:text-4xl font-black uppercase tracking-tight text-white"
                >
                  {tech.name}
                </h2>
              </div>

              <div className="flex items-center">
                <span className={`inline-flex items-center gap-1.5 rounded-xs border px-3 py-1 font-mono text-xs font-black tracking-widest uppercase ${statusMeta.badge}`}>
                  <span className="h-2 w-2 rounded-full bg-current animate-pulse" aria-hidden="true" />
                  {statusMeta.label}
                </span>
              </div>
            </div>

            {/* Telemetry Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Category */}
              <div className="rounded-xs border border-white/10 bg-black/50 p-3 sm:p-4">
                <span className="block font-mono text-[10.5px] uppercase tracking-wider text-gray-400">
                  SYSTEM_CATEGORY
                </span>
                <div className="mt-1 flex items-center gap-2 font-mono text-sm font-bold text-neon-blue">
                  <Cpu className="h-4 w-4" aria-hidden="true" />
                  <span>{categoryCode}</span>
                </div>
              </div>

              {/* Status */}
              <div className="rounded-xs border border-white/10 bg-black/50 p-3 sm:p-4">
                <span className="block font-mono text-[10.5px] uppercase tracking-wider text-gray-400">
                  DEPLOYMENT_STATUS
                </span>
                <div className="mt-1 flex items-center gap-2 font-mono text-sm font-bold text-neon-lime">
                  <Shield className="h-4 w-4" aria-hidden="true" />
                  <span>{tech.status} // OPERATIONAL</span>
                </div>
              </div>

              {/* Experience Level */}
              <div className="rounded-xs border border-white/10 bg-black/50 p-3 sm:p-4">
                <span className="block font-mono text-[10.5px] uppercase tracking-wider text-gray-400">
                  EXPERIENCE_LEVEL
                </span>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="font-mono text-sm font-bold text-white">
                    {experienceYears === 1 ? "1 YEAR" : `${experienceYears} YEARS`} ({experienceYears}/5)
                  </span>
                  <div className="flex items-center gap-1" aria-label={`Level ${experienceYears} of 5`}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`h-2 w-3 rounded-2xs ${
                          i < experienceYears ? "bg-neon-lime shadow-[0_0_6px_#c5ff00]" : "bg-white/10"
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Projects Used */}
              <div className="rounded-xs border border-white/10 bg-black/50 p-3 sm:p-4">
                <span className="block font-mono text-[10.5px] uppercase tracking-wider text-gray-400">
                  PROJECTS_DEPLOYED
                </span>
                <div className="mt-1 flex items-center gap-2 font-mono text-sm font-bold text-white">
                  <Database className="h-4 w-4 text-neon-lime" aria-hidden="true" />
                  <span>{projectsCount} Repositories & Systems</span>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="rounded-xs border border-white/10 bg-black/60 p-4 sm:p-5">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-3 font-mono text-xs font-bold text-neon-lime uppercase tracking-wider">
                <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
                <span>SPECIFICATION_MANIFEST</span>
              </div>
              <p
                id="tech-modal-desc"
                className="text-sm sm:text-base leading-relaxed text-gray-200"
              >
                {tech.description}
              </p>
              <p className="mt-3 text-xs sm:text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-2">
                {statusMeta.desc}
              </p>
            </div>

            {/* Key Capabilities / Highlights if provided */}
            {tech.highlights && tech.highlights.length > 0 && (
              <div className="rounded-xs border border-white/10 bg-black/40 p-4">
                <span className="block font-mono text-[10.5px] uppercase tracking-wider text-gray-400 mb-3">
                  SYSTEM_CAPABILITIES // HIGHLIGHTS
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {tech.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 font-mono text-xs text-gray-300 bg-white/5 px-2.5 py-1.5 rounded-2xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-neon-lime shrink-0" aria-hidden="true" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Action Footer */}
          <div className="flex items-center justify-between border-t border-white/10 bg-black/80 px-5 py-4">
            <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-gray-400">
              ESC_KEY_CLOSES_STREAM
            </span>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xs border border-neon-lime/40 bg-neon-lime px-5 py-2 font-mono text-xs font-black uppercase tracking-widest text-black transition hover:bg-[#bbf000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-lime focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
            >
              CLOSE TERMINAL [ESC]
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
