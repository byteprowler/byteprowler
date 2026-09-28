import React, { useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Activity, Cpu, Menu, RefreshCw, Terminal, X } from "lucide-react";
import Link from "next/link";
import ViewCounter from "../ui/ViewCounter";
import { NAV_SECTIONS } from "../../lib/navigation";

export default function Navbar() {
  const [sysTime, setSysTime] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const mobileMenuId = "byteprowler-mobile-nav";

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSysTime(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          closeMobileMenu();
        }
      }}
      className="fixed inset-x-0 top-0 z-90 mx-auto flex w-full max-w-7xl items-center justify-between gap-3 overflow-visible border-b border-neon-lime/15 bg-obsidian/95 px-4 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md supports-backdrop-filter:bg-obsidian/85 md:px-8"
    >
      {/* Brand Logo and Status */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xs bg-black border border-neon-lime/30 text-neon-lime shadow-glow-lime/40 shrink-0">
          <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neon-lime" />
          {/* <img src="/svg/byteprowler.svg" alt="ByteProwler Logo" loading="lazy" className="h-full w-full object-fit" /> */}
          <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-neon-green"></div>
        </div>
        <div className="flex flex-col">
          <Link href="/" className="font-mono text-xs sm:text-sm md:text-base font-black tracking-wider uppercase flex items-center gap-1 whitespace-nowrap">
            BYTEPROWLER <span className="text-[9px] sm:text-[10px] text-neon-lime/70 font-semibold font-mono">[SYS_v2.0.0]</span>
          </Link>
          <span className="text-[9px] sm:text-[10px] font-mono text-gray-300 uppercase tracking-tighter">
            HYPERVISOR_CONNECTED
          </span>
        </div>
      </div>

      {/* Center Status Logs (Decorative terminal status elements) */}
      <div className="hidden lg:flex items-center gap-6 font-mono text-xs text-gray-300">
        <div className="flex shrink-0 items-center gap-2 rounded-sm border border-neon-lime/10 bg-black/40 px-2 py-1">
          <Cpu className="w-3.5 h-3.5 text-neon-blue" />
          <span>ALLOC_VM_X01: <span className="text-neon-blue">ONLINE</span></span>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-sm border border-neon-lime/10 bg-black/40 px-2 py-1">
          <Activity className="w-3.5 h-3.5 text-neon-green" />
          <span>EST_LATENCY: <span className="text-neon-green">24MS</span></span>
        </div>
        <div className="flex items-center gap-2 border border-neon-lime/10 bg-black/40 px-2 py-1 rounded-sm">
          <RefreshCw className="w-3.5 h-3.5 text-neon-purple motion-safe:animate-spin" style={{ animationDuration: "6s" }} />
          <span>CYBER_HEARTBEAT: <span className="text-neon-purple font-medium">STABLE</span></span>
        </div>
      </div>

      {/* System Time and Dynamic View Counter info */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4 font-mono text-xs text-right">
        {/* Responsive View Counter */}
        <div className="hidden sm:flex items-center">
          <ViewCounter />
        </div>

        <div className="hidden md:flex flex-col items-end">
          <span className="text-[11px] text-gray-300 uppercase tracking-wider">SYSTEM_CLOCK</span>
          <span className="text-neon-lime font-bold select-all tracking-wider text-[11px] whitespace-nowrap">
            {sysTime || "FETCHING_CHRONOS..."}
          </span>
        </div>
        <div className="w-1.5 h-6 bg-neon-lime/30 hidden md:block"></div>

        <button
          type="button"
          aria-label={isMobileMenuOpen ? "Close mobile navigation menu" : "Open mobile navigation menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls={mobileMenuId}
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          className="lg:hidden relative flex h-11 w-11 items-center justify-center rounded-sm border border-neon-lime/30 bg-black/80 text-neon-lime shadow-glow-lime/10 transition-all duration-200 hover:border-neon-lime hover:bg-neon-lime/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-lime focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian active:scale-95"
        >
          <span className="absolute left-1.5 top-1.5 h-1 w-1 border-l border-t border-neon-lime/60" aria-hidden="true"></span>
          <span className="absolute bottom-1.5 right-1.5 h-1 w-1 border-b border-r border-neon-lime/60" aria-hidden="true"></span>
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            id={mobileMenuId}
            aria-label="Mobile navigation"
            initial={shouldReduceMotion ? false : { opacity: 0, y: -8, scaleY: 0.98 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scaleY: 0.98 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.18, ease: "easeOut" }}
            className="lg:hidden absolute left-3 right-3 top-[calc(100%+0.5rem)] z-[95] max-h-[calc(100vh-5.5rem)] origin-top overflow-y-auto rounded-sm border border-neon-lime/25 bg-[#050507]/95 p-3 text-left shadow-glow-lime/40 backdrop-blur-md sm:left-4 sm:right-4"
          >
            <div className="mb-2 flex items-center justify-between border-b border-neon-lime/15 pb-2 font-mono text-[11px] uppercase tracking-widest">
              <span className="text-neon-lime">[ MOBILE_SEC_INDEX ]</span>
              <span className="text-gray-300">ESC_CLOSE</span>
            </div>


            <div className="grid grid-cols-1 gap-1.5">
              {NAV_SECTIONS.map((item) => {
                const isActive = item.active !== false;

                if (!isActive) {
                  return (
                    <div
                      key={item.id}
                      aria-disabled="true"
                      className="flex min-h-11 items-center justify-between rounded-sm border border-white/5 bg-black/40 px-3 py-2 font-mono text-sm text-gray-500"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-[11px] font-bold">{`//${item.id}`}</span>
                        <span className="font-semibold tracking-wider">{item.label}</span>
                      </span>
                      <span className="rounded-xs bg-gray-900 px-1.5 py-0.5 text-[10.5px] uppercase tracking-tight">
                        {item.status}
                      </span>
                    </div>
                  );
                }

                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="group flex min-h-11 items-center justify-between rounded-sm border border-neon-lime/10 bg-black/60 px-3 py-2 font-mono text-sm text-neon-lime transition-all duration-200 hover:border-neon-lime/40 hover:bg-neon-lime/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-lime focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-gray-300 group-hover:text-neon-lime/60">{`//${item.id}`}</span>
                      <span className="font-semibold tracking-wider">{item.label}</span>
                    </span>
                    <span className="rounded-xs border border-neon-lime/20 bg-neon-lime/10 px-1.5 py-0.5 text-[10.5px] uppercase tracking-tight">
                      {item.status}
                    </span>
                  </a>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
