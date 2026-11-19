import { useEffect, useState } from "react";
import type { ScenePhase } from "./CharacterState";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const nextStep = {
  notice: { phase: "approach", delay: 240 },
  approach: { phase: "sit", delay: 510 },
  sit: { phase: "open", delay: 190 },
  open: { phase: "type", delay: 220 },
  type: { phase: "projects", delay: 360 },
} as const;

export function useCharacterController() {
  const [phase, setPhase] = useState<ScenePhase>("idle");

  useEffect(() => {
    if (phase === "idle" || phase === "projects") return;
    const preference = window.matchMedia(reducedMotionQuery);
    const reduce = () => {
      if (preference.matches) setPhase("projects");
    };
    preference.addEventListener("change", reduce);
    const step = nextStep[phase];
    const timer = window.setTimeout(() => setPhase(preference.matches ? "projects" : step.phase), step.delay);
    return () => {
      window.clearTimeout(timer);
      preference.removeEventListener("change", reduce);
    };
  }, [phase]);

  return {
    phase,
    toggleProjects: () => setPhase(phase === "idle"
      ? (window.matchMedia(reducedMotionQuery).matches ? "projects" : "notice")
      : "idle"),
    reset: () => setPhase("idle"),
  };
}
