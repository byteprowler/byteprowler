import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { profile } from "../../lib/profile";

const BOOT_SESSION_KEY = "byteprowler_boot_sequence_seen";

const bootLines = [
  { prefix: "~/BYTEPROWLER", text: "npx byteprowler --init", tone: "command" },
  { prefix: "INFO", text: `BYTEPROWLER SYS V2.0 // Kernel ${profile.systemVersion}`, tone: "info" },
  { prefix: "OK", text: "Loading kernel... ok", tone: "success" },
  { prefix: "OK", text: "Loading UI modules (React 19 & Tailwind v4)... ok", tone: "success" },
  { prefix: "OK", text: "Loading activity systems... ok", tone: "success" },
  { prefix: "OK", text: "Loading GitHub signal... ok", tone: "success" },
  { prefix: "OK", text: "Loading AniList sync... ok", tone: "success" },
  { prefix: "OK", text: "Loading Last.fm signal... ok", tone: "success" },
  { prefix: "OK", text: "Mounting project logs & terminal arsenal... ok", tone: "success" },
  { prefix: "WARN", text: "SYS_STATUS: Hypervisor active. Welcome back operator.", tone: "warn" },
  { prefix: "OK", text: "Initialization complete. Ready.", tone: "success" },
] as const;

interface BootSequenceCompleteEvent {
  userInitiated: boolean;
}

interface BootSequenceProps {
  enabled?: boolean;
  onComplete?: (event: BootSequenceCompleteEvent) => void;
}

function getToneClass(tone: (typeof bootLines)[number]["tone"]) {
  if (tone === "command") return "text-neon-blue";
  if (tone === "info") return "text-neon-blue";
  if (tone === "warn") return "text-neon-lime";
  return "text-neon-green";
}

export default function BootSequence({ enabled = true, onComplete }: BootSequenceProps) {
  const shouldReduceMotion = useReducedMotion();
  // Start visible immediately so no initial white/empty tick occurs
  const [isVisible, setIsVisible] = useState(true);
  const [lineCount, setLineCount] = useState(() => (shouldReduceMotion ? bootLines.length : 1));

  const completeBoot = useCallback((userInitiated = false) => {
    try {
      window.sessionStorage.setItem(BOOT_SESSION_KEY, "true");
    } catch {
      // If sessionStorage is unavailable, continue gracefully
    }
    setIsVisible(false);
    onComplete?.({ userInitiated });
  }, [onComplete]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return;
    }

    try {
      if (window.sessionStorage.getItem(BOOT_SESSION_KEY) === "true") {
        const skipTimer = window.setTimeout(() => completeBoot(false), 0);
        return () => window.clearTimeout(skipTimer);
      }
    } catch {
      // Ignore sessionStorage errors
    }

    // Keyboard shortcut to skip boot with Escape or Enter
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter") {
        event.preventDefault();
        completeBoot(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    let lineInterval: number | undefined;
    let completeTimeout: number | undefined;

    if (shouldReduceMotion) {
      completeTimeout = window.setTimeout(() => completeBoot(false), 500);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        if (completeTimeout) window.clearTimeout(completeTimeout);
      };
    }

    let index = 1;
    // 180ms per line * 11 lines = ~2.0 seconds + 450ms finish delay = ~2.45s (target: 2-4 seconds)
    lineInterval = window.setInterval(() => {
      index += 1;
      setLineCount(Math.min(index, bootLines.length));

      if (index >= bootLines.length) {
        if (lineInterval) {
          window.clearInterval(lineInterval);
        }
        completeTimeout = window.setTimeout(() => completeBoot(false), 450);
      }
    }, 180);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (lineInterval) {
        window.clearInterval(lineInterval);
      }
      if (completeTimeout) {
        window.clearTimeout(completeTimeout);
      }
    };
  }, [completeBoot, enabled, shouldReduceMotion]);

  const visibleLines = bootLines.slice(0, lineCount);
  const isReady = lineCount >= bootLines.length;

  return (
    <AnimatePresence>
      {enabled && isVisible && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Byteprowler system boot sequence"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.28, ease: "easeInOut" }}
          className="fixed inset-0 z-[120] flex min-h-screen items-center justify-center bg-obsidian px-4 py-6 text-gray-100"
        >
          <div className="absolute inset-0 terminal-grid opacity-60" aria-hidden="true" />
          <div className="relative w-full max-w-2xl rounded-sm border border-neon-lime/25 bg-black/95 p-4 font-mono shadow-[0_0_35px_rgba(197,255,0,0.1)] sm:p-6">
            {/* Terminal Window Header */}
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-neon-lime/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-neon-blue/80" />
              </div>
              <span className="min-w-0 break-words text-right text-[11px] font-black uppercase tracking-widest text-neon-lime">
                ~/BYTEPROWLER // SYSTEM_BOOT
              </span>
            </div>

            {/* Boot Log Output */}
            <div className="space-y-2 text-xs leading-relaxed text-gray-200 sm:text-sm">
              <div className="min-h-[18rem] space-y-1.5 overflow-hidden sm:min-h-[19rem]">
                {visibleLines.map((line, idx) => (
                  <p key={`${line.text}-${idx}`} className="flex gap-2 break-words">
                    <span className={`shrink-0 font-black ${getToneClass(line.tone)}`}>
                      {line.tone === "command" ? ">" : `[${line.prefix}]`}
                    </span>
                    <span className="font-mono">{line.tone === "command" ? `${line.prefix} $ ${line.text}` : line.text}</span>
                  </p>
                ))}
              </div>
              <p className="sr-only" role="status" aria-live="polite">
                {isReady ? "Byteprowler portfolio initialization complete." : "Byteprowler system booting."}
              </p>
            </div>

            {/* Footer Control Bar */}
            <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-gray-400">
                <span>STATUS: </span>
                <span className={isReady ? "text-neon-lime font-bold" : "text-neon-blue font-bold animate-pulse"}>
                  {isReady ? "INITIALIZED // READY" : "LOADING_SYSTEM_MODULES..."}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline font-mono text-[10px] text-gray-400">
                  [ESC / ENTER TO SKIP]
                </span>
                <button
                  type="button"
                  onClick={() => completeBoot(true)}
                  className="min-h-10 rounded-sm border border-neon-lime/30 bg-neon-lime/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-neon-lime transition hover:border-neon-lime hover:bg-neon-lime hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-lime focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
                >
                  Skip Boot
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
