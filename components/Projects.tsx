"use client";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { PROJECTS, L, type Project } from "@/lib/content";
import { ProjectImage } from "./ProjectImage";
import { ProjectModal } from "./ProjectModal";
import { StatusBadge } from "./StatusBadge";
export function Projects() {
  const { t, lang } = useI18n();
  const [active, setActive] = useState<Project | null>(null);
  return (
    <section aria-labelledby="quests-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">WORLD 03 / {t("nav.projects")}</p>
          <h2 id="quests-title">{t("world.projects")}</h2>
          <p className="section-description">{t("projSub")}</p>
        </div>
        <span className="section-token">03</span>
      </div>
      <div className="proj-grid">
        {PROJECTS.map((project, i) => (
          <article className="quest-card" key={project.slug}>
            <button
              className="quest-cover"
              aria-label={`${t("preview")}: ${project.name}`}
              onClick={() => setActive(project)}
            >
              <span className="quest-window">
                <span>QUEST_0{i + 1}</span>
                <span aria-hidden="true">− □ ×</span>
              </span>
              <ProjectImage
                src={project.images?.[0]}
                name={project.name}
                slug={project.slug}
              />
              <span className="quest-overlay">{t("preview")} ↗</span>
            </button>
            <div className="quest-body">
              <div className="quest-meta">
                <span>QUEST 0{i + 1}</span>
                <StatusBadge status={project.status} />
              </div>
              <h3>
                <button onClick={() => setActive(project)}>
                  {project.name}
                </button>
              </h3>
              <p>{L(project.desc, lang)}</p>
              <div className="proj-tags">
                {project.tech.map((tech) => (
                  <span className="tag" key={tech}>
                    {tech}
                  </span>
                ))}
              </div>
              <div className="quest-links">
                <button onClick={() => setActive(project)}>
                  {t("preview")} <span>→</span>
                </button>
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub ↗
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
