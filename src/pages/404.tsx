import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, FolderCode } from "lucide-react";
import SEO from "../components/seo/SEO";

export default function Custom404() {
  return (
    <>
      <SEO
        title="ERROR 404: ROUTE_NOT_FOUND | Byteprowler"
        description="The requested path does not exist in the Byteprowler system."
        image="/og-byteprowler.jpg"
        noindex
      />
      <main className="min-h-screen bg-obsidian px-4 py-20 text-gray-100 grid place-items-center">
        <section className="w-full max-w-2xl border border-neon-lime/20 bg-black/75 rounded-sm p-6 font-mono shadow-glow-lime/5">
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-6">
            <span className="text-[11px] font-black uppercase tracking-widest text-neon-lime">
              [ ROUTE_SCAN_FAILED ]
            </span>
            <AlertTriangle className="h-5 w-5 text-neon-lime" aria-hidden="true" />
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-sans">
              ERROR 404: ROUTE_NOT_FOUND
            </h1>
            <p className="text-sm leading-relaxed text-gray-300">
              The requested path does not exist in this system. Return to the base node or inspect active project logs.
            </p>

            <div className="mt-3 flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-neon-lime/90 px-4 py-3 text-xs font-black uppercase text-black transition hover:bg-neon-lime focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-lime focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Return to Base
              </Link>
              <Link
                href="/#projects"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-white/10 bg-white/5 px-4 py-3 text-xs font-black uppercase text-white transition hover:border-neon-blue/35 hover:text-neon-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
              >
                <FolderCode className="h-4 w-4" aria-hidden="true" />
                View Projects
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
