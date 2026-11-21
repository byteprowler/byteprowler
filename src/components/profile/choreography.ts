import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function choreograph(scope: HTMLElement) {
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia(scope);
  media.add("(min-width: 761px) and (prefers-reduced-motion: no-preference)", () => {
    for (const project of scope.querySelectorAll<HTMLElement>("[data-project]")) {
      gsap.timeline({ scrollTrigger: { trigger: project, start: "top 90%", end: "center 57%", scrub: 0.35 } })
        .from(project.querySelector("[data-artwork]"), { scale: 1.14, ease: "none" }, 0)
        .from(project.querySelector("[data-project-copy]")?.children ?? [], { y: 25, stagger: 0.08 }, 0);
    }

    const marks = scope.querySelectorAll("[data-process-mark]");
    scope.querySelectorAll("[data-process-step]").forEach((step, index) => {
      gsap.from(marks[index], {
        scaleX: 0.13,
        ease: "none",
        scrollTrigger: { trigger: step, start: "top 82%", end: "center 52%", scrub: 0.25 },
      });
    });
  });
  return () => media.revert();
}
