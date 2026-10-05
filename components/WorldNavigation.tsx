"use client";
import { WORLDS, useWorld } from "@/lib/world";
import { useI18n } from "@/lib/i18n";
export function WorldNavigation() {
  const { active, visited, openWorld } = useWorld();
  const { t } = useI18n();
  return (
    <div className="world-map wrap">
      <div className="map-heading">
        <span className="eyebrow">{t("world.select")}</span>
        <span>{t("world.noGame")}</span>
      </div>
      <nav className="world-navigation" aria-label={t("world.select")}>
        {WORLDS.map((world, i) => (
          <button
            key={world}
            className={`world-choice ${active === world ? "active" : ""}`}
            aria-pressed={active === world}
            aria-controls={world}
            onClick={() => openWorld(world)}
          >
            <span className="world-number">0{i + 1}</span>
            <span>
              <small>WORLD 0{i + 1}</small>
              <strong>{t(`world.${world}`)}</strong>
              <span className="world-subtitle">{t(`nav.${world}`)}</span>
            </span>
            <span
              className={`world-mark ${visited.includes(world) ? "found" : ""}`}
              aria-label={
                visited.includes(world)
                  ? t("world.visited")
                  : t("world.unvisited")
              }
            >
              {visited.includes(world) ? "✓" : "↗"}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
