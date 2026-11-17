import type { NextApiRequest, NextApiResponse } from "next";
import { afterEach, describe, expect, it, vi } from "vitest";
import handler from "../../pages/api/github/repo";
import { projects } from "../../lib/projects";

function request(query: NextApiRequest["query"]) {
  const response = { status: vi.fn(), json: vi.fn(), setHeader: vi.fn() };
  response.status.mockReturnValue(response);
  return {
    response,
    run: () => handler({ method: "GET", query } as NextApiRequest, response as unknown as NextApiResponse),
  };
}

const publicProject = projects.find(project => project.useGithubMetadata && project.repoVisibility === "public" && project.githubRepo && project.githubOwner)!;
const query = { owner: publicProject.githubOwner, repo: publicProject.githubRepo };

describe("public repository metadata", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns public metadata without authorization", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ private: false, stargazers_count: 3 }));
    vi.stubGlobal("fetch", fetchMock);
    const { run, response } = request(query);
    await run();
    expect(new Headers(fetchMock.mock.calls[0][1].headers).has("Authorization")).toBe(false);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ ok: true, repo: expect.objectContaining({ stars: 3 }) }));
  });

  it("rejects unconfigured repositories before fetching", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const { run, response } = request({ owner: "unconfigured-owner", repo: "unconfigured-repo" });
    await run();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(404);
  });

  it.each([Response.json({ private: true }), new Response(null, { status: 429 })])(
    "returns a safe fallback when upstream metadata is unavailable",
    async upstream => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(upstream));
      const { run, response } = request(query);
      await run();
      expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ ok: false }));
    },
  );
});
