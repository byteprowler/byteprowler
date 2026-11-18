import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, FileText, Radio } from "lucide-react";
import { profile } from "../../lib/profile";
import { getDevUptimeStats } from "../../lib/devStats";
import OperatorStatusPanel from "../ui/OperatorStatusPanel";
import DeveloperTelemetry from "../ui/DeveloperTelemetry";
import ResumeProtocol from "../ui/ResumeProtocol";
import GlitchBrandTitle from "../ui/GlitchBrandTitle";


export default function Hero() {
  const [typedTagline, setTypedTagline] = useState("");
  const [isResumeProtocolOpen, setIsResumeProtocolOpen] = useState(false);

  const taglineText = profile.tagline;
  const devStats = getDevUptimeStats();

  const [isBooted, setIsBooted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsBooted(true), 180);
    return () => window.clearTimeout(timer);
  }, []);

  // Typing effect for the tagline
  useEffect(() => {
    if (isBooted) {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= taglineText.length) {
          setTypedTagline(taglineText.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 45);
      return () => clearInterval(interval);
    }
  }, [isBooted, taglineText]);

  return (
    <section id="home" className="py-8 md:pt-6 md:pb-8 w-full flex flex-col gap-10 select-none">

      {/* Upper Terminal HUD Decorator Module */}
      <div className="w-full flex justify-between items-center border border-neon-lime/10 bg-black/40 px-4 py-2.5 rounded-sm overflow-hidden text-xs font-mono text-gray-300 shadow-glow-lime/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-lime animate-ping"></div>
          <span className="text-neon-lime font-bold text-[11px] tracking-wider uppercase">
            [SYS_MONITOR_ACTIVE]
          </span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span className="hidden sm:inline">IP: 127.0.0.1:3000</span>
        </div>
        <div className="flex items-center gap-4">
          <span>PORT_STATUS: <span className="text-neon-green font-semibold">SECURE</span></span>
          <span className="hidden md:inline">NODE_CLUSTER: UK-S1</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-2">

        {/* Main Content Pane */}
        <div className="col-span-1 md:col-span-8 min-w-0 flex flex-col gap-8 relative">

          {/* Subtle hacker matrix lines panel */}
          <div className="absolute -left-4 top-1/4 w-1 h-3/4 border-l border-neon-lime/20 flex flex-col justify-between py-1 pointer-events-none">
            <div className="w-1.5 h-1.5 bg-neon-lime -ml-1"></div>
            <div className="w-1.5 h-1.5 bg-neon-lime -ml-1"></div>
          </div>

          <div className="flex flex-col gap-3">
            {/* HUD tag from top design */}
            <div className="font-mono text-[11px] text-neon-lime tracking-widest font-semibold bg-neon-lime/10 border border-neon-lime/20 px-2 py-0.5 rounded-sm w-fit uppercase">
              [USER_AUTH_SYSTEM]_HYPERVISOR_v1.0.4
            </div>

            {/* Giant Branding Heading */}
            <div className="flex flex-col gap-1">
              <GlitchBrandTitle />

              {/* Built by Real Name label */}
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: isBooted ? 1 : 0, y: isBooted ? 0 : 5 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-mono text-xs sm:text-sm text-gray-300 mt-1 uppercase tracking-widest flex items-center gap-2 select-none"
              >
                <span className="text-neon-lime font-mono animate-pulse">&gt;</span> Built by <span className="text-white font-extrabold">{profile.realName}</span>
                <span className="text-gray-300">|</span>
                <span className="text-neon-blue font-bold tracking-tight text-xs">{profile.role}</span>
              </motion.div>
            </div>

            {/* Simulated interactive typed tagline as seen in video */}
            <div className="min1 flex items-center">
              <span className="text-base sm:text-lg md:text-xl leading-relaxed font-mono text-neon-blue font-bold tracking-wider uppercase transition-all">
                {typedTagline}
                {isBooted && typedTagline.length < taglineText.length && (
                  <span className="animate-pulse text-neon-blue">|</span>
                )}
              </span>
            </div>
          </div>

          {/* Developer Tagline / Short Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: isBooted ? 1 : 0, y: isBooted ? 0 : 15 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-300 max-w-xl font-sans leading-relaxed border-l-2 border-neon-purple/40 pl-4 py-1"
          >
            {profile.detailedBio}
            <span className="mt-3 block font-mono text-xs font-bold uppercase tracking-wider text-neon-lime">
              Current arc: frontend systems, fullstack expansion, and production-ready builds.
            </span>
          </motion.div>

          {/* Terminal Identity Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: isBooted ? 1 : 0, y: isBooted ? 0 : 15 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-xl border border-neon-blue/20 bg-black/60 p-4 rounded-sm font-mono text-xs flex flex-col gap-2.5 relative hover:border-neon-blue/45 transition-colors duration-300 shadow-glow-blue/5"
          >
            {/* Top tag */}
            <div className="flex justify-between items-center text-[11px] text-gray-300 border-b border-white/5 pb-2 mb-1 select-none">
              <span className="text-neon-blue font-bold tracking-wider">[ BYTEPROWLER_IDENTITY ]</span>
              <span className="text-gray-300">{"// DECRYPTED_PROFILE"}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between py-0.5 border-b border-white/5">
                <span className="text-gray-300 uppercase font-black">OPERATOR:</span>
                <span className="text-white font-black">{profile.realName}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-white/5">
                <span className="text-gray-300 uppercase font-black">ROLE:</span>
                <span className="text-neon-lime font-bold">{profile.role}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-white/5">
                <span className="text-gray-300 uppercase font-black">MODE:</span>
                <span className="text-neon-blue font-bold">Building scalable systems</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-white/5">
                <span className="text-gray-300 uppercase font-black">STATUS:</span>
                <span className="text-neon-green font-bold flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse"></span>
                  ONLINE
                </span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-white/5">
                <span className="text-gray-300 uppercase font-black">DEV_UPTIME:</span>
                <span className="text-neon-purple font-bold">{devStats.daysSinceStart}D ACTIVE</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-white/5">
                <span className="text-gray-300 uppercase font-black">BOOT_SEQUENCE:</span>
                <span className="text-neon-blue font-bold">STARTED {devStats.startYear}</span>
              </div>
            </div>
          </motion.div>

          {/* Action CTAs mapped directly from requirements */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: isBooted ? 1 : 0, y: isBooted ? 0 : 15 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4 items-center mt-2 z-10"
          >
            {/* Primary CTA (View Projects / Neon fill yellow/lime) */}
            <a
              href="#projects"
              onClick={(e) => {
                const target = document.getElementById("projects");
                if (target) {
                  e.preventDefault();
                  target.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="px-6 py-3.5 bg-neon-lime hover:bg-[#b0e500] hover:scale-[1.02] text-black font-mono text-sm font-bold uppercase transition-all duration-300 rounded-sm flex items-center gap-2 shadow-lg hover:shadow-glow-lime/20 border border-transparent cursor-pointer"
            >
              <span>VIEW PROJECTS</span>
              <ArrowRight className="w-4 h-4 text-black stroke-[3px]" />
            </a>

            {/* Secondary CTA (Initialize Uplink / black theme with neon border) */}
            <a
              href="#contact"
              onClick={(e) => {
                const target = document.getElementById("contact");
                if (target) {
                  e.preventDefault();
                  target.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="px-6 py-3.5 bg-black hover:bg-neon-lime/10 border border-neon-lime/30 text-neon-lime font-mono text-sm font-bold uppercase tracking-wider rounded-sm flex items-center gap-2 transition-all duration-300 shadow-sm hover:shadow-glow-lime/10 cursor-pointer"
            >
              <Radio className="w-4 h-4 text-neon-lime animate-pulse" />
              <span>INITIALIZE UPLINK</span>
            </a>

            <button
              type="button"
              onClick={() => setIsResumeProtocolOpen(true)}
              className="px-5 py-3.5 bg-black/70 hover:bg-white/5 border border-white/10 hover:border-neon-blue/35 text-neon-blue font-mono text-sm font-bold uppercase tracking-wider rounded-sm flex items-center gap-2 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
              aria-label="Open role-based resume protocol"
            >
              <FileText className="w-4 h-4 text-neon-blue" />
              <span>ACCESS_RESUME</span>
            </button>
            <noscript>
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">ACCESS_RESUME</a>
            </noscript>
          </motion.div>

        </div>

        {/* Operator status module (right side panel) */}
        <div className="col-span-1 md:col-span-4 min-w-0 flex flex-col">
          <OperatorStatusPanel />
        </div>

      </div>

      <DeveloperTelemetry />

      <ResumeProtocol
        isOpen={isResumeProtocolOpen}
        onClose={() => setIsResumeProtocolOpen(false)}
        source="hero"
        fallbackResumeUrl={profile.resumeUrl}
      />
    </section>
  );
}
