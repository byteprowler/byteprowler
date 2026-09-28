import { describe, it, expect } from "vitest";
import { resumeProfiles, defaultResumeProfile } from "../../lib/content/resumeProfiles";
import { matchResumeProfile } from "../../lib/resumeMatcher";

describe("Resume System Logic", () => {
  it("provides available role profiles with valid configuration", () => {
    expect(resumeProfiles.length).toBeGreaterThan(0);

    for (const profile of resumeProfiles) {
      expect(profile.id).toBeDefined();
      expect(profile.label).toBeDefined();
      expect(profile.file).toMatch(/\.pdf$/);
      expect(profile.focusAreas.length).toBeGreaterThan(0);
      expect(profile.roleTags.length).toBeGreaterThan(0);
    }
  });

  it("matchResumeProfile() selects frontend profile for frontend role", () => {
    const result = matchResumeProfile("Frontend Developer", ["UI implementation", "Responsive design"]);
    expect(result.profile).toBeDefined();
    expect(result.profile.id).toBe("frontend");
    expect(result.score).toBeGreaterThan(0);
    expect(result.reason).toContain("Frontend Developer");
  });

  it("matchResumeProfile() selects react-next for TypeScript and Next.js focus", () => {
    const result = matchResumeProfile("React / Next.js Developer", ["Frontend architecture", "API integration"]);
    expect(result.profile).toBeDefined();
    expect(result.profile.id).toBe("react-next");
    expect(result.score).toBeGreaterThan(0);
  });

  it("matchResumeProfile() falls back gracefully to default profile if no matches", () => {
    const result = matchResumeProfile("Quantum Computational Biologist", []);
    expect(result.profile).toBeDefined();
    expect(result.profile.id).toBe(defaultResumeProfile.id);
  });
});
