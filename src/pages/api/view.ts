import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (!["GET", "POST"].includes(req.method || "")) {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ message: "METHOD_NOT_ALLOWED" });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) return res.status(503).json({ message: "VIEW_SIGNAL_UNAVAILABLE" });
  const viewKey = process.env.BYTEPROWLER_VIEW_KEY || "byteprowler:portfolio:views";
  try {
    if (req.method === "GET") {
      const { data, error } = await supabase.from("portfolio_views").select("count").eq("id", viewKey).maybeSingle();
      if (error) throw error;
      return res.status(200).json({ count: Number(data?.count ?? 0) });
    }
    const visitorId = req.body?.visitorId;
    if (typeof visitorId !== "string" || !/^[a-zA-Z0-9_-]{20,128}$/.test(visitorId) || req.body?.pagePath !== "/") {
      return res.status(400).json({ message: "INVALID_VIEW_REQUEST" });
    }
    const { data, error } = await supabase.rpc("record_portfolio_visit", { view_id: viewKey, visit_token: visitorId });
    if (error) throw error;
    const result = Array.isArray(data) ? data[0] : data;
    if (!result || !Number.isFinite(Number(result.total))) throw new Error("Invalid counter result");
    return res.status(200).json({ count: Number(result.total), counted: result.counted, cooldownActive: !result.counted });
  } catch {
    console.error("VIEW_SIGNAL_UNAVAILABLE: check Supabase configuration and counter migration");
    return res.status(503).json({ message: "VIEW_SIGNAL_UNAVAILABLE" });
  }
}
