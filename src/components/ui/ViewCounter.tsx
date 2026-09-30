import React, { useEffect, useRef, useState } from "react";
import { Eye } from "lucide-react";

const VISITOR_ID_KEY = "byteprowler_anon_visitor_id";
const VIEW_COOLDOWN_KEY = "byteprowler_view_cooldown_until";
const VIEW_COOLDOWN_MS = 1000 * 60 * 60 * 6;

function createVisitorId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `visitor_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function getAnonymousVisitorId() {
  try {
    const existingId = localStorage.getItem(VISITOR_ID_KEY);
    if (existingId) return existingId;

    const nextId = createVisitorId();
    localStorage.setItem(VISITOR_ID_KEY, nextId);
    return nextId;
  } catch {
    return "";
  }
}

function isCooldownActive() {
  try {
    const cooldownUntil = Number(localStorage.getItem(VIEW_COOLDOWN_KEY) || 0);
    return Number.isFinite(cooldownUntil) && cooldownUntil > Date.now();
  } catch {
    return false;
  }
}

function setViewCooldown() {
  try {
    localStorage.setItem(VIEW_COOLDOWN_KEY, String(Date.now() + VIEW_COOLDOWN_MS));
  } catch {
    // localStorage can be unavailable in hardened browsers; server-side safeguards still apply.
  }
}

/**
 * ViewCounter displays the public portfolio count without storing personal data.
 * It sends only an anonymous browser-generated visitor id and the current path.
 */
export default function ViewCounter() {
  const [views, setViews] = useState<number | null>(null);
  const [hasError, setHasError] = useState(false);
  const networkFired = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || networkFired.current) return;
    networkFired.current = true;

    const syncCounter = async () => {
      try {
        const visitorId = getAnonymousVisitorId();
        const shouldIncrement = Boolean(visitorId) && !isCooldownActive();
        const response = await fetch("/api/view", {
          method: shouldIncrement ? "POST" : "GET",
          headers: { "Content-Type": "application/json" },
          body: shouldIncrement
            ? JSON.stringify({
                visitorId,
                pagePath: window.location.pathname || "/",
              })
            : undefined,
        });

        if (!response.ok) {
          throw new Error("HTTP response link terminal error");
        }

        const data = await response.json();

        if (typeof data.count === "number") {
          setViews(data.count);
          if (shouldIncrement) {
            setViewCooldown();
          }
        } else {
          throw new Error("Stream integrity error: count missing from data object");
        }
      } catch (error) {
        console.error("ViewCounter synchronization failed:", error);
        setHasError(true);
      }
    };

    void syncCounter();
  }, []);

  const padViews = views !== null ? String(views).padStart(6, "0") : "------";

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 border border-neon-lime/15 bg-black/60 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-sm font-mono text-[10px] sm:text-[11px] uppercase select-none transition-all duration-300 neon-border-lime">
      <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neon-lime animate-pulse shrink-0" />
      <span className="text-gray-400 font-bold tracking-widest text-[10px] sm:text-[10px] max-[440px]:hidden">VIEWS:</span>
      {hasError ? (
        <span className="text-red-500 font-black tracking-wider text-[10px] sm:text-[11px] bg-red-950/20 px-1 rounded-sm">
          LINK_ERR
        </span>
      ) : views === null ? (
        <span className="text-neon-lime/40 animate-pulse font-bold tracking-widest text-[10px] sm:text-[11px]">
          CONNECTING...
        </span>
      ) : (
        <span className="text-neon-lime font-black tracking-wider neon-glow-lime text-[10px] sm:text-[11px]">
          {padViews}
        </span>
      )}
    </div>
  );
}
