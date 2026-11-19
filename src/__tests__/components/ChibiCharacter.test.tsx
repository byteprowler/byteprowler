import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ChibiCharacter from "../../components/chibi/ChibiCharacter";
import { characterState, type CharacterState } from "../../components/chibi/CharacterState";

// Pose tests inspect SVG markup. Chrome covers the compiled stylesheet.
vi.mock("../../components/chibi/world.module.css", () => ({ default: {} }));

const poses = [
  ["idle", "idle", "normal"],
  ["walking", "walking", "normal"],
  ["sitting", "sitting", "normal"],
  ["openingLaptop", "openingLaptop", "focused"],
  ["typing", "typing", "focused"],
  ["celebrating", "idle", "happy"],
] as const satisfies ReadonlyArray<readonly [CharacterState, string, string]>;

describe("workshop mascot", () => {
  it.each(poses)("renders %s with the %s pose and %s face", (state, pose, face) => {
    const { container } = render(<ChibiCharacter state={state} />);
    const character = container.querySelector("svg");

    expect(character).toHaveAttribute("aria-hidden", "true");
    expect(character).toHaveAttribute("data-pose", pose);
    expect(character?.querySelector(`[data-face="${face}"]`)).toBeInTheDocument();
    expect(character?.querySelector('[data-face="blink"]')).toBeInTheDocument();
  });

  it("uses distinct sit, reach, and typing poses during the existing laptop sequence", () => {
    expect([characterState.sit, characterState.open, characterState.type, characterState.projects])
      .toEqual(["sitting", "openingLaptop", "typing", "typing"]);
  });
});
