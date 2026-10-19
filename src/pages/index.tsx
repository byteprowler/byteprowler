import React from "react";
import SEO from "../components/seo/SEO";
import Layout from "../components/layout/Layout";
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Roadmap from "../components/sections/Roadmap";
import TechArsenal from "../components/sections/TechArsenal";
import Projects from "../components/sections/Projects";
import Certifications from "../components/sections/Certifications";
import AnimeFeed from "../components/sections/AnimeFeed";
import SignalLogs from "../components/sections/SignalLogs";
import Contact from "../components/sections/Contact";
import { SITE_URL } from "../lib/site";
import { profile } from "../lib/profile";
import { siteSettings } from "../lib/content/siteSettings";

export default function Home() {
  return (
    <>
      <SEO
        title={`${profile.realName} (ByteProwler) | ${profile.role}`}
        description={`${profile.realName}, also known as ByteProwler, builds clean, responsive web interfaces with React, Next.js, TypeScript, and Tailwind CSS. Available for work and collaboration.`}
        url="/"
        structuredData={{ "@context": "https://schema.org", "@graph": [
          { "@type": "Person", "@id": `${SITE_URL}/#person`, name: profile.realName, alternateName: "ByteProwler", jobTitle: profile.role, url: SITE_URL, sameAs: [siteSettings.githubUrl, siteSettings.linkedinUrl] },
          { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "ByteProwler", url: SITE_URL, author: { "@id": `${SITE_URL}/#person` } },
        ] }}
        image="/og-byteprowler.jpg"
      />

      <Layout>
        <Hero />
        <About />
        <Roadmap />
        <TechArsenal />
        <Projects />
        <Certifications />
        <AnimeFeed />
        <SignalLogs />
        <Contact />
      </Layout>
    </>
  );
}
