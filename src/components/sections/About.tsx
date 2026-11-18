import React from "react";
import { motion } from "motion/react";
import { Shield, Brain, Cpu, Layers } from "lucide-react";
import TerminalCard from "../ui/TerminalCard";
import { profile } from "../../lib/profile";

export default function About() {
  const brandMetrics = [
    { label: "BRAND_IDENTIFIER", val: profile.brandName },
    { label: "OPERATOR_IDENTITY", val: profile.realName },
    { label: "CORE_FOCUS", val: profile.classTag },
    { label: "BUILD_STYLE", val: "ACCESSIBLE_RESPONSIVE_UI" },
    { label: "ACTIVE_COORDINATE", val: profile.location },
  ];

  const parameters = [
    {
      icon: <Brain className="w-5 h-5 text-neon-lime" />,
      title: "CLEAN FRONTEND SYSTEMS",
      desc: "Building modular, responsive view layers with clear component boundaries, strong hierarchy, and interaction details that keep interfaces easy to use.",
    },
    {
      icon: <Cpu className="w-5 h-5 text-neon-blue" />,
      title: "PERFORMANCE AS THE PRIORITY",
      desc: "Prioritizing lean bundles, lazy loading, and careful client integrations so interfaces stay fast without becoming fragile.",
    },
    {
      icon: <Layers className="w-5 h-5 text-neon-purple" />,
      title: "FULL-STACK ADAPTABILITY",
      desc: "Bridging frontend systems with clean APIs, backend routes, SQL data, and real-time synchronization as the stack expands.",
    },
  ];

  return (
    <section id="about" className="py-12 md:pt-12 md:pb-24 border-t border-neon-lime/5 scroll-mt-20">

      {/* Section Indicator HUD */}
      <div className="flex items-center gap-2 mb-8 font-mono text-xs text-gray-400">
        <span className="text-neon-lime font-mono">[02]</span>
        <span className="tracking-widest font-semibold uppercase">NEURAL_SYNC_PROFILE</span>
        <div className="flex-grow h-[1px] bg-neon-lime/10"></div>
        <span className="text-[10px] text-neon-lime/40 uppercase">ENGINE_SECURE</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

        {/* Left Column: Brand Telemetry Status Display */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          <TerminalCard
            title="brand_descriptor.log"
            command="./cat profile_stats"
            accentColor="lime"
            className="h-full"
          >
            <div className="flex flex-col gap-5 font-mono">
              <div className="text-[11px] text-gray-400 leading-normal border-b border-white/5 pb-3 font-mono">
                {"// System monitoring loaded. Reviewing Byteprowler's developer profile, frontend focus, and modular architecture rules."}
              </div>

              <div className="flex flex-col gap-3">
                {brandMetrics.map((metric, i) => (
                  <div key={i} className="flex justify-between items-center text-xs font-mono py-1 border-b border-white/5">
                    <span className="text-gray-400 font-bold tracking-wider">{metric.label}</span>
                    <span className="text-neon-lime font-black bg-neon-lime/5 px-2 py-0.5 rounded-sm">
                      {metric.val}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-neon-lime/5 border border-neon-lime/10 rounded-sm flex items-start gap-3">
                <Shield className="w-5 h-5 text-neon-lime flex-shrink-0 animate-pulse mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-neon-lime uppercase tracking-wider font-mono">
                    System Protocol Active
                  </span>
                  <span className="text-[10.5px] text-gray-400 font-mono leading-relaxed mt-0.5">
                    Public UI stays clean while sensitive integrations stay behind server-side routes.
                  </span>
                </div>
              </div>
            </div>
          </TerminalCard>
        </div>

        {/* Right Column: Narrative Mission and Core Disciplines */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-8">

          {/* Main Narrative Card */}
          <TerminalCard
            title="identity_sequence.md"
            command="./source run_profile"
            accentColor="blue"
          >
            <div className="flex flex-col gap-5">
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight uppercase font-sans">
                BUILDING CLEAN, RESPONSIVE WEB INTERFACES
              </h3>
              <span lang="ja" className="font-mono text-sm font-bold text-neon-blue/80">自己紹介</span>

              <p className="text-gray-400 text-sm leading-relaxed font-sans">
                I am <span className="text-neon-blue font-semibold">{profile.brandName}</span> (built and operated by <span className="text-white font-bold">{profile.realName}</span>), a frontend developer focused on
                clean interface architecture, responsive systems, and polished full-stack-ready web experiences.
                Clear structure, accessible UI, and maintainable styling are the foundation I build from.
              </p>

              <p className="text-gray-400 text-sm leading-relaxed font-sans">
                From layout systems to API connections and backend routes, I build interfaces
                that feel sharp, usable, and reliable. I keep the Byteprowler terminal identity intact while
                growing stronger React, Next.js, Tailwind, TypeScript, and fullstack workflows.
              </p>
            </div>
          </TerminalCard>

          {/* Core Focus Parameter List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {parameters.map((param, index) => (
              <div
                key={index}
                className="border border-white/5 bg-black/40 p-4 rounded-sm hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3 group hover:border-neon-blue/20"
              >
                <div className="p-2 rounded-xs bg-white/5 w-fit group-hover:bg-neon-blue/10 transition-colors duration-300">
                  {param.icon}
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-xs font-black text-white font-mono uppercase tracking-wider">
                    {param.title}
                  </h4>
                  <p className="text-[10px] text-gray-400 leading-relaxed mt-1">
                    {param.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </section>
  );
}
