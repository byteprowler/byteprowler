import Image from "next/image";
import Link from "next/link";
import type { Project } from "../../lib/projects";
import { trackProjectLink } from "../../lib/posthog";
import styles from "./Profile.module.css";

export default function ProjectFeature({ project, index }: { project: Project; index: number }) {
  const image = project.coverImage ?? project.image;
  return (
    <article className={styles.project} data-project>
      <Link className={styles.projectVisual} href={`/projects/${project.slug}`} aria-label={`Read about ${project.title}`}>
        <div className={styles.artwork} data-artwork aria-hidden={image ? undefined : true}>
          {image ? (
            <Image src={image} alt={`${project.title} project visual`} fill sizes="(max-width: 760px) 92vw, 55vw" />
          ) : (
            <span className={styles.motif} data-motif={index}><i /><i /><i /><i /><i /></span>
          )}
        </div>
        <span className={styles.visualLabel} aria-hidden="true">{project.type}</span>
      </Link>
      <div className={styles.projectCopy} data-project-copy>
        <p className={styles.label}>{project.year} / {project.status.replaceAll("_", " ").toLowerCase()}</p>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <p className={styles.meta}>{project.role}<br />{project.stack.join(" · ")}</p>
        <div className={styles.links}>
          <Link href={`/projects/${project.slug}`}>Case study<span className="sr-only"> for {project.title}</span></Link>
          {project.liveUrl && <a href={project.liveUrl} data-portfolio-tracked onClick={() => trackProjectLink("live", project, project.liveUrl!)}>Live project<span className="sr-only"> for {project.title}</span></a>}
          {project.githubUrl && project.repoVisibility === "public" && <a href={project.githubUrl} data-portfolio-tracked onClick={() => trackProjectLink("github", project, project.githubUrl!)}>Source<span className="sr-only"> for {project.title}</span></a>}
        </div>
        {project.versions && <details className={styles.versions}>
          <summary>Project versions</summary>
          {project.versions.map(version => <p key={version.label}><strong>{version.title} · {version.status}</strong><br />{version.description}</p>)}
        </details>}
      </div>
    </article>
  );
}
