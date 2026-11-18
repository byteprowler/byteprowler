import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { NAV_SECTIONS } from "../../lib/navigation";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="w-full min-h-screen flex flex-col relative z-10">
      <Navbar />

      <main className="grow w-full max-w-7xl mx-auto px-4 md:px-8 pt-24 md:pt-28 pb-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          <div className="col-span-full lg:col-span-10 xl:col-span-11 min-w-0 min-h-[70vh]">
            {children}
          </div>

          <aside className="hidden lg:flex lg:col-span-2 xl:col-span-1 flex-col items-end fixed right-8 top-1/4 z-50 h-auto">
            <div className="border border-neon-lime/10 bg-black/60 backdrop-blur-md p-4 rounded-sm flex flex-col gap-5 text-right w-48 neon-border-lime">
              <div className="text-[11px] text-neon-lime/60 font-mono tracking-widest uppercase border-b border-neon-lime/20 pb-2">
                [ SEC_INDEX_v1.0.4 ]
              </div>
              <nav className="flex flex-col gap-3">
                {NAV_SECTIONS.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={(e) => {
                      if (!item.active) {
                        e.preventDefault();
                      }
                    }}
                    className={`font-mono text-xs flex flex-col items-end transition-all duration-300 group ${
                      item.active
                        ? "text-neon-lime opacity-100 transform translate-x-0.5 cursor-pointer"
                        : "text-gray-500 hover:text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-300 font-bold group-hover:text-neon-lime/40">
                        {`//${item.id}`}
                      </span>
                      <span className="font-semibold tracking-wider font-mono">
                        {item.label}
                      </span>
                    </div>
                    <span
                      className={`text-[10.5px] font-mono tracking-tighter uppercase px-1 mt-0.5 rounded-xs ${
                        item.active ? "bg-neon-lime/10 text-neon-lime" : "bg-gray-900 text-gray-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </Link>
                ))}
              </nav>

              <div className="border-t border-neon-lime/10 pt-2 flex flex-col items-end">
                <span className="text-[11px] font-mono text-gray-300 uppercase">SYS_GRID_PING</span>
                <span className="text-[11px] font-mono text-neon-green">ACTIVE (24ms)</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
