import { useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import SEO from "../components/seo/SEO";
import ProjectFeature from "../components/profile/ProjectFeature";
import styles from "../components/profile/Profile.module.css";
import { profile } from "../lib/content/profile";
import { siteSettings } from "../lib/content/siteSettings";
import { getProjectBySlug } from "../lib/projects";
import { canonicalUrl } from "../lib/site";
import { capturePortfolioEvent } from "../lib/posthog";

const featured = ["prowlerpos", "giveroll", "A-slime-s-guide-to-Elysium"].flatMap(slug => {
  const project = getProjectBySlug(slug);
  return project ? [project] : [];
});

const capabilities = [
  ["Interface engineering", "Responsive layouts, accessible controls and motion that helps people follow a change.", "React · Next.js · TypeScript · Tailwind CSS · Motion"],
  ["Product workflows", "Give each step a clear state, from a restaurant order to a live draw or a chapter reveal.", "Interaction design · State modeling · Prototyping"],
  ["Data & APIs", "Connect interfaces to structured data and keep sensitive work on the server.", "Supabase · PostgreSQL · Express · Next.js API routes"],
];

const process = [
  ["Trace the workflow", "Follow the steps people already take. In a restaurant, that means following an order from the table to the kitchen."],
  ["Make the states visible", "Name what can change and what people need to see at each step. Give loading, empty and error states a place in the design."],
  ["Build the smallest complete path", "Get one journey working end to end. Pull out reusable components once their responsibilities are clear."],
  ["Try it under pressure", "Use a narrow screen, a keyboard and less-than-perfect data. Refine the places where the interface stops giving people enough feedback."],
];

export default function Profile() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scope = root.current;
    if (!scope) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const preference = window.matchMedia("(min-width: 761px) and (prefers-reduced-motion: no-preference)");
    const load = () => {
      if (!preference.matches || cleanup) return;
      void import("../components/profile/choreography").then(({ choreograph }) => {
        if (!disposed && preference.matches && !cleanup) cleanup = choreograph(scope);
      }).catch(() => {});
    };
    load();
    preference.addEventListener("change", load);
    return () => {
      disposed = true;
      preference.removeEventListener("change", load);
      cleanup?.();
    };
  }, []);

  return (
    <div className={styles.profile} ref={root} id="top">
      <SEO title="ByteProwler — Joshua Ogo, Frontend Developer"
        description="Selected interface and product engineering work by Joshua Ogo, the frontend developer behind ByteProwler."
        url="/profile" image="/og-profile.png"
        structuredData={{ "@context": "https://schema.org", "@type": "ProfilePage", url: canonicalUrl("/profile"),
          mainEntity: { "@type": "Person", name: profile.realName, alternateName: "ByteProwler", jobTitle: profile.role,
            sameAs: [siteSettings.githubUrl, siteSettings.linkedinUrl] } }} />
      <Head>
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="theme-color" content="#f4f1e9" />
      </Head>
      <a className={styles.skip} href="#profile-content">Skip to content</a>
      <header className={styles.header}>
        <a className={styles.wordmark} href="#top">byteprowler<span>.</span></a>
        <nav aria-label="Profile navigation">
          <a href="#work">Work</a><a href="#about">About</a><a href="#process">Process</a><a href="#contact">Contact</a>
        </nav>
        <Link href="/" prefetch={false} className={styles.terminal}>Terminal</Link>
      </header>
      <main id="profile-content" tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="intro">
          <div className={styles.heroCopy}>
            <p className={styles.label}>{profile.realName} / {profile.role}</p>
            <h1 id="intro"><span>Interfaces</span><span>with a <em>pulse.</em></span></h1>
            <p>I’m the developer behind ByteProwler. I build product interfaces and use motion to make complex workflows easier to follow.</p>
            <a className={styles.primary} href="#work">Explore selected work</a>
          </div>
          <div className={styles.heroArt} aria-hidden="true">
            <div className={styles.orbit}><i /><i /><i /><i /><i /><i /></div>
            <span>INPUT</span><span>RESPONSE</span>
          </div>
        </section>
        <section id="work" className={styles.work} aria-labelledby="work-title">
          <div className={styles.sectionHead}>
            <h2 id="work-title">Selected work</h2>
            <Link href="/projects">View all work</Link>
          </div>
          {featured.map((project, index) => <ProjectFeature key={project.slug} project={project} index={index} />)}
        </section>
        <div className={styles.editorial}>
          <section aria-labelledby="stack-title" className={styles.split}>
            <h2 id="stack-title">What I build with</h2>
            <div>{capabilities.map(([title, description, stack]) => <article className={styles.capability} key={title}>
              <h3>{title}</h3><p>{description}</p><p className={styles.meta}>{stack}</p>
            </article>)}</div>
          </section>
          <section id="about" className={styles.about} aria-labelledby="about-title">
            <p className={styles.label}>Behind the work</p>
            <h2 id="about-title">I like interfaces that <em>know when to wait.</em></h2>
            <p>A spoiler-aware encyclopedia has to know when to reveal a detail. A kitchen display has to show a new order right away. I like working out what the interface should surface in each moment, then finding a visual language that makes the decision feel natural.</p>
          </section>
          <section id="process" className={styles.process} aria-labelledby="process-title">
            <div className={styles.processSide}>
              <h2 id="process-title">From first sketch to working interface</h2>
              <div className={styles.processGraphic} aria-hidden="true">
                {process.map(([title]) => <i key={title} data-process-mark />)}
              </div>
            </div>
            <ol>{process.map(([title, description]) => <li key={title} data-process-step>
              <h3>{title}</h3><p>{description}</p>
            </li>)}</ol>
          </section>
          <section className={styles.split} aria-labelledby="now-title">
            <h2 id="now-title">Currently</h2>
            <div><h3>From frontend systems into fullstack development</h3>
              <p>{profile.detailedBio}</p></div>
          </section>
        </div>
      </main>
      <footer id="contact" className={styles.contact}>
        <p className={styles.label}>Available for collaboration</p>
        <h2>Have an interface worth figuring out?</h2>
        <a className={styles.primary} href={`mailto:${siteSettings.email}`} onClick={() => capturePortfolioEvent("portfolio_contact_started", { source: "profile_email" })}>Email Joshua</a>
        <div className={styles.links}>
          <a href={siteSettings.githubUrl}>GitHub</a><a href={siteSettings.linkedinUrl}>LinkedIn</a>
          <a href={siteSettings.resumeUrl}>Résumé</a><a href="#top">Back to top</a>
        </div>
      </footer>
    </div>
  );
}
