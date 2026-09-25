import { describe, it, expect } from "vitest";
import { getHomepageProjects, getProjectBySlug, projects } from "../../lib/projects";

describe("Project Utilities", () => {
  it("getHomepageProjects() returns projects with showOnHome !== false", () => {
    const homepageProjects = getHomepageProjects(6);
    expect(homepageProjects.length).toBeGreaterThan(0);
    expect(homepageProjects.length).toBeLessThanOrEqual(6);

    for (const project of homepageProjects) {
      expect(project.showOnHome).not.toBe(false);
      expect(project.slug).toBeDefined();
      expect(project.title).toBeDefined();
    }
  });

  it("getHomepageProjects() prioritizes featured projects first", () => {
    const homepageProjects = getHomepageProjects(10);
    if (homepageProjects.length > 1) {
      const firstFeatured = homepageProjects.findIndex((p) => p.isFeatured);
      const firstNonFeatured = homepageProjects.findIndex((p) => !p.isFeatured);
      if (firstFeatured !== -1 && firstNonFeatured !== -1) {
        expect(firstFeatured).toBeLessThan(firstNonFeatured);
      }
    }
  });

  it("getProjectBySlug() returns the correct project for existing slug", () => {
    const existing = projects[0];
    const found = getProjectBySlug(existing.slug);
    expect(found).toBeDefined();
    expect(found?.slug).toBe(existing.slug);
    expect(found?.title).toBe(existing.title);
  });

  it("getProjectBySlug() returns undefined for non-existent slug", () => {
    const found = getProjectBySlug("non-existent-system-node-999");
    expect(found).toBeUndefined();
  });
});
