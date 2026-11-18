import React, { useEffect, useMemo, useRef, useState } from "react";
import { FileText, ShieldCheck, X } from "lucide-react";
import { resumeProfiles } from "@/lib/content/resumeProfiles";
import { matchResumeProfile } from "@/lib/resumeMatcher";
import { captureResumeEvent } from "@/lib/posthog";
import Button from "./Button";

export type ResumeProtocolSource = "hero" | "contact" | "footer" | "unknown";

interface ResumeProtocolProps {
  isOpen: boolean;
  onClose: () => void;
  source?: ResumeProtocolSource;
  fallbackResumeUrl?: string;
}

const focusOptions = [
  "UI implementation",
  "Responsive design",
  "Frontend architecture",
  "API integration",
  "Backend learning/growth",
  "Documentation",
  "Email templates",
  "Component systems",
];

export default function ResumeProtocol({
  isOpen,
  onClose,
  source = "unknown",
  fallbackResumeUrl = "/public/pdf/resume.pdf",
}: ResumeProtocolProps) {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(resumeProfiles[0]?.label ?? "Frontend Developer");
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([]);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const hasTrackedRecommendationRef = useRef(false);

  const recommendation = useMemo(
    () => matchResumeProfile(selectedRole, selectedFocusAreas),
    [selectedFocusAreas, selectedRole],
  );

  useEffect(() => {
    if (!isOpen) return;

    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();
    captureResumeEvent("resume_protocol_opened", { source });
  }, [isOpen, source]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      hasTrackedRecommendationRef.current = false;
      return;
    }

    if (step === 3 && !hasTrackedRecommendationRef.current) {
      captureResumeEvent("resume_recommendation_generated", {
        recommendedResumeId: recommendation.profile.id,
        recommendedResumeLabel: recommendation.profile.label,
        selectedRole,
        focusCount: selectedFocusAreas.length,
      });
      hasTrackedRecommendationRef.current = true;
    }
  }, [isOpen, recommendation.profile.id, recommendation.profile.label, selectedFocusAreas.length, selectedRole, step]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  if (!isOpen) return null;

  function handleClose() {
    captureResumeEvent("resume_protocol_closed", {
      step,
      hadRecommendation: step === 3,
    });
    onClose();
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }

  function handleRoleSelect(role: string) {
    setSelectedRole(role);
    captureResumeEvent("resume_role_selected", { role });
  }

  function handleFocusToggle(focusArea: string) {
    setSelectedFocusAreas((current) => {
      const next = current.includes(focusArea)
        ? current.filter((item) => item !== focusArea)
        : [...current, focusArea];

      captureResumeEvent("resume_focus_selected", {
        focusAreas: next,
        count: next.length,
      });
      return next;
    });
  }

  function handleDownloadClick() {
    captureResumeEvent("resume_download_clicked", {
      resumeId: recommendation.profile.id,
      resumeLabel: recommendation.profile.label,
      filePath: recommendation.profile.file,
      source,
    });
  }

  return (
    <div
      className="fixed inset-0 z-90 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-protocol-title"
        aria-describedby="resume-protocol-description"
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-sm border border-neon-lime/25 bg-obsidian p-4 shadow-glow-lime/10 sm:p-5"
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(175,255,0,0.04)_1px,transparent_1px)] bg-size-[100%_6px] opacity-30" />

        <div className="relative z-10 flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
            <div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-neon-lime">
                ACCESS_RESUME // ROLE_BASED_RESUME
              </span>
              <h2 id="resume-protocol-title" className="mt-1 text-xl font-black uppercase text-white">
                Resume Protocol
              </h2>
              <p id="resume-protocol-description" className="mt-1 text-sm leading-relaxed text-gray-300">
                Select the role signal and focus areas to route the closest pre-made resume packet.
              </p>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              className="min-h-10 min-w-10 rounded-sm border border-white/10 bg-black/70 text-gray-200 transition hover:border-neon-lime/40 hover:text-neon-lime focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-lime focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
              aria-label="Close Resume Protocol"
            >
              <X className="mx-auto h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-widest text-gray-300">
            {["ROLE_SIGNAL", "FOCUS_MATRIX", "PACKET_ROUTE"].map((label, index) => (
              <span
                key={label}
                className={`rounded-sm border px-2 py-1 font-bold ${
                  step === index + 1
                    ? "border-neon-lime/40 bg-neon-lime/10 text-neon-lime"
                    : "border-white/10 bg-black/40 text-gray-300"
                }`}
              >
                {index + 1}. {label}
              </span>
            ))}
          </div>

          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="font-mono text-sm font-bold uppercase text-neon-blue">
                  What role are you hiring for?
                </h3>
                <p className="mt-1 text-sm text-gray-300">
                  Choose the closest target. This only routes existing resume PDFs.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {resumeProfiles.map((profile) => {
                  const isActive = selectedRole === profile.label;
                  return (
                    <button
                      key={profile.id}
                      type="button"
                      onClick={() => handleRoleSelect(profile.label)}
                      className={`rounded-sm border p-3 text-left font-mono text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian ${
                        isActive
                          ? "border-neon-blue/50 bg-neon-blue/10 text-white"
                          : "border-white/10 bg-black/50 text-gray-300 hover:border-neon-blue/30"
                      }`}
                      aria-pressed={isActive}
                    >
                      <span className="block font-black uppercase">{profile.label}</span>
                      <span className="mt-1 block text-[11px] leading-relaxed text-gray-300">{profile.description}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setStep(2)} variant="secondary">
                  NEXT: FOCUS_MATRIX
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="font-mono text-sm font-bold uppercase text-neon-blue">
                  What matters most for this role?
                </h3>
                <p className="mt-1 text-sm text-gray-300">
                  Select one or more signals. Active choices are marked as selected.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {focusOptions.map((focusArea) => {
                  const isActive = selectedFocusAreas.includes(focusArea);
                  return (
                    <button
                      key={focusArea}
                      type="button"
                      onClick={() => handleFocusToggle(focusArea)}
                      className={`rounded-sm border px-3 py-2.5 text-left font-mono text-xs font-bold uppercase transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-lime focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian ${
                        isActive
                          ? "border-neon-lime/50 bg-neon-lime/10 text-neon-lime"
                          : "border-white/10 bg-black/50 text-gray-300 hover:border-neon-lime/30"
                      }`}
                      aria-pressed={isActive}
                    >
                      {isActive ? "[SELECTED] " : "[ ] "}
                      {focusArea}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <Button onClick={() => setStep(1)} variant="ghost">
                  BACK
                </Button>
                <Button onClick={() => setStep(3)} variant="secondary">
                  GENERATE_PACKET_ROUTE
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div className="rounded-sm border border-neon-green/25 bg-neon-green/5 p-4">
                <div className="flex items-center gap-2 font-mono text-[11px] font-black uppercase tracking-widest text-neon-green">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  RECOMMENDED_RESUME_PACKET
                </div>
                <h3 className="mt-3 text-lg font-black uppercase text-white">
                  {recommendation.profile.label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-300">{recommendation.reason}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-300">{recommendation.profile.bestFor}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {recommendation.profile.focusAreas.slice(0, 5).map((focusArea) => (
                    <span
                      key={focusArea}
                      className="rounded-sm border border-white/10 bg-black/45 px-2 py-1 font-mono text-[11px] font-bold uppercase text-gray-200"
                    >
                      {focusArea}
                    </span>
                  ))}
                </div>

                <div className="mt-4 rounded-sm border border-neon-blue/15 bg-black/45 p-3 font-mono text-[11px] leading-relaxed text-gray-300">
                  <span className="block font-bold uppercase text-neon-blue">RESUME_PACKET_PATH_CONFIGURED</span>
                  Place the matching PDF in public/resumes/ when the final packets are ready.
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Button onClick={() => setStep(2)} variant="ghost">
                  BACK
                </Button>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <a
                    href={fallbackResumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="terminal-button border-white/10 bg-black/45 text-gray-200 hover:border-neon-blue/35 hover:bg-neon-blue/10 hover:text-neon-blue"
                  >
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    VIEW_GENERAL_RESUME
                  </a>
                  <a
                    href={recommendation.profile.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    data-portfolio-tracked="true"
                    onClick={handleDownloadClick}
                    className="terminal-button border-transparent bg-neon-lime text-black shadow-glow-lime/10 hover:bg-[#bbf000] hover:shadow-glow-lime/25"
                  >
                    <FileText className="h-4 w-4 text-black" aria-hidden="true" />
                    DOWNLOAD_MATCHED_RESUME
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
