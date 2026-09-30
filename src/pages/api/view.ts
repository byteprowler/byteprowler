import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin";

interface ViewResponse {
  count: number;
  counted?: boolean;
  cooldownActive?: boolean;
  _fallback?: boolean;
  _sandbox?: boolean;
  message?: string;
}

const DEFAULT_VIEW_KEY = "byteprowler:portfolio:views";
const DEFAULT_PAGE_PATH = "/";
const VIEW_COOLDOWN_MINUTES = 60 * 6;

let sandboxMemoryCounter = 0;

function sanitizePagePath(pagePath: unknown) {
  if (typeof pagePath !== "string" || !pagePath.startsWith("/")) {
    return DEFAULT_PAGE_PATH;
  }

  return pagePath.slice(0, 180);
}

function sanitizeVisitorId(visitorId: unknown) {
  if (typeof visitorId !== "string") return "";
  const cleanVisitorId = visitorId.trim();
  if (!/^[a-zA-Z0-9:_-]{8,128}$/.test(cleanVisitorId)) return "";
  return cleanVisitorId;
}

function getCooldownCutoff() {
  return new Date(Date.now() - VIEW_COOLDOWN_MINUTES * 60 * 1000).toISOString();
}

function isMissingEventSchemaError(error: { code?: string; message?: string } | null) {
  const message = error?.message?.toLowerCase() || "";
  return (
    error?.code === "42703" ||
    error?.code === "42P01" ||
    message.includes("visitor_id") ||
    message.includes("page_path") ||
    message.includes("created_at")
  );
}

async function getLegacyCount(supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>, viewKey: string) {
  const { data, error } = await supabase
    .from("portfolio_views")
    .select("count")
    .eq("id", viewKey)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      const { data: insertData, error: insertError } = await supabase
        .from("portfolio_views")
        .insert([{ id: viewKey, count: 0 }])
        .select("count")
        .single();

      if (insertError) throw insertError;
      return Number(insertData?.count ?? 0);
    }

    throw error;
  }

  return Number(data?.count ?? 0);
}

async function incrementLegacyCount(supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>, viewKey: string) {
  const { data, error: rpcError } = await supabase
    .rpc("increment_portfolio_view", { view_id: viewKey });

  if (!rpcError && typeof data === "number") {
    return data;
  }

  const currentCount = await getLegacyCount(supabase, viewKey);
  const newCount = currentCount + 1;
  const { error: upsertError } = await supabase
    .from("portfolio_views")
    .upsert({ id: viewKey, count: newCount, updated_at: new Date().toISOString() });

  if (upsertError) throw upsertError;
  return newCount;
}

async function getEventCount(supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>) {
  const { count, error } = await supabase
    .from("portfolio_views")
    .select("id", { count: "exact", head: true });

  if (error) throw error;
  return count ?? 0;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ViewResponse | { error: string }>
) {
  const method = req.method;
  const viewKey = process.env.BYTEPROWLER_VIEW_KEY || DEFAULT_VIEW_KEY;
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    if (method === "POST") {
      sandboxMemoryCounter += 1;
    }

    return res.status(200).json({
      count: sandboxMemoryCounter,
      counted: method === "POST",
      _sandbox: true,
      message: "Supabase credentials are not configured. View counter is using memory fallback.",
    });
  }

  try {
    if (method === "GET") {
      try {
        return res.status(200).json({ count: await getEventCount(supabase) });
      } catch (error) {
        if (!isMissingEventSchemaError(error as { code?: string; message?: string })) {
          throw error;
        }

        return res.status(200).json({ count: await getLegacyCount(supabase, viewKey), _fallback: true });
      }
    }

    if (method !== "POST") {
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }

    const visitorId = sanitizeVisitorId(req.body?.visitorId);
    const pagePath = sanitizePagePath(req.body?.pagePath);

    if (!visitorId) {
      try {
        return res.status(200).json({
          count: await getEventCount(supabase),
          counted: false,
          message: "Anonymous visitor id missing. Count was read without incrementing.",
        });
      } catch (error) {
        if (!isMissingEventSchemaError(error as { code?: string; message?: string })) {
          throw error;
        }

        return res.status(200).json({
          count: await getLegacyCount(supabase, viewKey),
          counted: false,
          _fallback: true,
        });
      }
    }

    try {
      const { data: recentView, error: recentError } = await supabase
        .from("portfolio_views")
        .select("id")
        .eq("visitor_id", visitorId)
        .eq("page_path", pagePath)
        .gte("created_at", getCooldownCutoff())
        .limit(1)
        .maybeSingle();

      if (recentError) throw recentError;

      if (!recentView) {
        const { error: insertError } = await supabase
          .from("portfolio_views")
          .insert([{ visitor_id: visitorId, page_path: pagePath }]);

        if (insertError) throw insertError;
      }

      return res.status(200).json({
        count: await getEventCount(supabase),
        counted: !recentView,
        cooldownActive: Boolean(recentView),
      });
    } catch (error) {
      if (!isMissingEventSchemaError(error as { code?: string; message?: string })) {
        throw error;
      }

      return res.status(200).json({
        count: await incrementLegacyCount(supabase, viewKey),
        counted: true,
        _fallback: true,
      });
    }
  } catch (error) {
    console.error("Supabase counter route error:", error instanceof Error ? error.message : error);
    return res.status(200).json({
      count: sandboxMemoryCounter,
      _fallback: true,
      message: "View counter fallback activated.",
    });
  }
}
