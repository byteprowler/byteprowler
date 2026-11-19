export type CharacterState =
  | "idle"
  | "walking"
  | "sitting"
  | "openingLaptop"
  | "typing"
  | "reading"
  | "listening"
  | "thinking"
  | "sleeping"
  | "celebrating";

export type ScenePhase = "idle" | "notice" | "approach" | "sit" | "open" | "type" | "projects";

export const characterState = {
  idle: "idle",
  notice: "thinking",
  approach: "walking",
  sit: "sitting",
  open: "openingLaptop",
  type: "typing",
  projects: "typing",
} as const satisfies Record<ScenePhase, CharacterState>;
