import { beforeEach, describe, it, expect, vi } from "vitest";
import type { NextApiRequest, NextApiResponse } from "next";
import handler from "../../pages/api/view";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin";
vi.mock("../../lib/supabaseAdmin", () => ({ getSupabaseAdmin: vi.fn() }));
function response() {
  const res = { setHeader: vi.fn(), status: vi.fn(), json: vi.fn() };
  res.status.mockReturnValue(res);
  return res;
}
const request = (method: string, body?: unknown) => ({ method, body }) as NextApiRequest;
describe("view API", () => {
  beforeEach(() => vi.clearAllMocks());
  it("reads the aggregate count rather than counting rows", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: { count: 1284 } });
    vi.mocked(getSupabaseAdmin).mockReturnValue({ from: () => ({ select: () => ({ eq: () => ({ maybeSingle }) }) }) } as never);
    const res = response();
    await handler(request("GET"), res as unknown as NextApiResponse);
    expect(res.json).toHaveBeenCalledWith({ count: 1284 });
  });
  it.each([true, false])("returns atomic RPC deduplication result counted=%s", async counted => {
    const rpc = vi.fn().mockResolvedValue({ data: [{ total: 12, counted }] });
    vi.mocked(getSupabaseAdmin).mockReturnValue({ rpc } as never);
    const res = response();
    await handler(request("POST", { visitorId: "anonymous-visit-token-1234", pagePath: "/" }), res as unknown as NextApiResponse);
    expect(res.json).toHaveBeenCalledWith({ count: 12, counted, cooldownActive: !counted });
    expect(rpc).toHaveBeenCalledOnce();
  });
  it("rejects non-homepage increments", async () => {
    vi.mocked(getSupabaseAdmin).mockReturnValue({} as never);
    const res = response();
    await handler(request("POST", { visitorId: "anonymous-visit-token-1234", pagePath: "/projects" }), res as unknown as NextApiResponse);
    expect(res.status).toHaveBeenCalledWith(400);
  });
  it("returns unavailable when Supabase is missing", async () => {
    vi.mocked(getSupabaseAdmin).mockReturnValue(null);
    const res = response();
    await handler(request("GET"), res as unknown as NextApiResponse);
    expect(res.status).toHaveBeenCalledWith(503);
  });
  it("returns unavailable on database failure without exposing errors or inventing counts", async () => {
    vi.mocked(getSupabaseAdmin).mockReturnValue({ rpc: vi.fn().mockResolvedValue({ error: new Error("private database details") }) } as never);
    const res = response();
    await handler(request("POST", { visitorId: "anonymous-visit-token-1234", pagePath: "/" }), res as unknown as NextApiResponse);
    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({ message: "VIEW_SIGNAL_UNAVAILABLE" });
  });
});
