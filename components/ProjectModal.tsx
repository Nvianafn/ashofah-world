"use client";
import { useI18n } from "@/lib/i18n";
import { L, type Project } from "@/lib/content";
import { Dialog } from "./Dialog";
import { Carousel } from "./Carousel";
import { StatusBadge } from "./StatusBadge";
export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const { t, lang } = useI18n();
  return (
    <Dialog
      open={!!project}
      onClose={onClose}
      title={project?.name || t("world.projects")}
      className="project-dialog"
    >
      {project && (
        <div className="project-detail">
          <div className="pm-media">
            <Carousel
              key={project.slug}
              slides={(project.images?.length ? project.images : [""]).map(
                (src) => ({ src, label: project.name }),
              )}
              slug={project.slug}
            />
          </div>
          <div className="pm-info">
            <p className="eyebrow">
              {t("world.projects")} / {project.slug}
            </p>
            <StatusBadge status={project.status} />
            <h2>{project.name}</h2>
            <p>{L(project.desc, lang)}</p>
            <div>
              <h3 className="pm-label">{t("techUsed")}</h3>
              <div className="proj-tags">
                {project.tech.map((tech) => (
                  <span className="tag" key={tech}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="pm-links">
              {project.live && (
                <a
                  className="btn btn-primary"
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("preview")} ↗
                </a>
              )}
              <a
                className="btn"
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
