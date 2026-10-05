"use client";
import { useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { BIO, L } from "@/lib/content";
import { useWorld } from "@/lib/world";
import { GameWorld } from "./GameWorld";
export function Hero() {
  const { t, lang } = useI18n();
  const { active, visited, openWorld, sound, toggleSound } = useWorld();
  const [started, setStarted] = useState(false);
  const arena = useRef<HTMLDivElement>(null);
  return (
    <section className="hero" aria-labelledby="adventure-title">
      <div className="sky-stars" aria-hidden="true">
        {Array.from({ length: 30 }, (_, i) => (
          <i
            key={i}
            style={{
              left: `${(i * 137 + 11) % 100}%`,
              top: `${(i * 29 + 7) % 85}%`,
              opacity: 0.3 + (i % 3) * 0.2,
            }}
          />
        ))}
      </div>
      <div className="wrap hero-hud">
        <span>
          PLAYER <b>01</b>
        </span>
        <span>
          WORLD{" "}
          <b>
            0{["about", "stack", "projects", "contact"].indexOf(active) + 1}
          </b>
        </span>
        <span>
          {t("world.found")} <b>{String(visited.length).padStart(2, "0")}/04</b>
        </span>
        <button
          className="sound-toggle"
          onClick={toggleSound}
          aria-pressed={sound}
        >
          {sound ? "♫" : "♪"} {t("sound")} {sound ? t("on") : t("off")}
        </button>
      </div>
      <div className="hero-copy wrap">
        <p className="hero-intro">
          <span className="tiny-star" aria-hidden="true">
            ✦
          </span>{" "}
          {BIO.name}{" "}
          <span className="tiny-star" aria-hidden="true">
            ✦
          </span>
        </p>
        <h1 id="adventure-title">
          ASHOFAH<span>WORLD</span>
        </h1>
        <p className="hero-role">{L(BIO.role, lang)}</p>
        <p className="hero-tagline">{L(BIO.tagline, lang)}</p>
        <div className="hero-cta">
          <button
            className="btn btn-primary"
            onClick={() => {
              setStarted(true);
              arena.current?.focus({ preventScroll: true });
            }}
          >
            <span aria-hidden="true">▶</span>{" "}
            {started ? t("game.continue") : t("game.start")}
          </button>
          <a
            className="hero-projects"
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              openWorld("projects");
            }}
          >
            {t("cta.work")} <span aria-hidden="true">↗</span>
          </a>
        </div>
        <p className="hero-note">
          {started ? t("game.instructions") : t("game.intro")}
        </p>
      </div>
      <GameWorld
        arenaRef={arena}
        started={started}
        onStart={() => setStarted(true)}
      />
      <div className="level-caption wrap">
        <span>
          <i /> {t("game.caption")}
        </span>
        <span>© ASHOFAH WORLD · PLAYER 01</span>
      </div>
    </section>
  );
}
