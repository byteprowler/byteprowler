import { useEffect, type PointerEvent, type RefObject } from "react";

const gestures = ["blink", "glance", "stretch"] as const;
const pause = { minimum: 3800, variation: 4900, gesture: 850 };

export function useWorkshopIdle(stage: RefObject<HTMLDivElement | null>, enabled: boolean) {
  useEffect(() => {
    const room = stage.current;
    if (!enabled || !room) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number | undefined;

    function clear() {
      window.clearTimeout(timer);
      room?.removeAttribute("data-gesture");
    }

    function schedule() {
      clear();
      if (preference.matches || document.hidden) return;
      timer = window.setTimeout(() => {
        const gesture = gestures[Math.floor(Math.random() * gestures.length)];
        room?.setAttribute("data-gesture", gesture);
        timer = window.setTimeout(schedule, gesture === "blink" ? 150 : pause.gesture);
      }, pause.minimum + Math.random() * pause.variation);
    }

    schedule();
    preference.addEventListener("change", schedule);
    document.addEventListener("visibilitychange", schedule);
    return () => {
      clear();
      preference.removeEventListener("change", schedule);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [stage, enabled]);
}

export function moveRoom(event: PointerEvent<HTMLDivElement>) {
  if (event.pointerType !== "mouse"
    || !window.matchMedia("(min-width: 760px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
  const room = event.currentTarget;
  const rect = room.getBoundingClientRect();
  room.style.setProperty("--room-x", `${((event.clientX - rect.left) / rect.width - .5) * 8}px`);
  room.style.setProperty("--room-y", `${((event.clientY - rect.top) / rect.height - .5) * 6}px`);
}

export function resetRoom(event: PointerEvent<HTMLDivElement>) {
  event.currentTarget.style.removeProperty("--room-x");
  event.currentTarget.style.removeProperty("--room-y");
}
