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
        title="ByteProwler | Frontend Developer Portfolio"
        description="Byteprowler is a hacker-inspired developer portfolio showcasing frontend projects, certifications, build logs, and web interface work."
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
