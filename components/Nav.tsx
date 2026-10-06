"use client";
import Image from "next/image";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { WORLDS, useWorld } from "@/lib/world";
export function Nav() {
  const { t, lang, setLang } = useI18n();
  const { active, openWorld } = useWorld();
  const [open, setOpen] = useState(false);
  return (
    <header className="nav">
      <nav className="wrap" aria-label={t("navigation")}>
        <a className="brand" href="#top">
          <picture className="brand-mark">
            <source
              media="(max-width: 360px)"
              srcSet="/images/brand/dino-hood-small.svg"
            />
            <Image
              className="brand-logo"
              src="/images/brand/dino-hood.svg"
              alt=""
              aria-hidden="true"
              width={32}
              height={32}
              unoptimized
            />
          </picture>
          ASHOFAH<span className="brand-domain">.ME</span>
        </a>
        <div id="main-navigation" className={`nav-links ${open ? "open" : ""}`}>
          {WORLDS.map((world) => (
            <a
              key={world}
              href={`#${world}`}
              aria-current={active === world ? "location" : undefined}
              onClick={(e) => {
                e.preventDefault();
                openWorld(world);
                setOpen(false);
              }}
            >
              {t(`nav.${world}`)}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <div className="lang-toggle" aria-label={t("language")}>
            {(["en", "id"] as const).map((l) => (
              <button
                key={l}
                aria-pressed={lang === l}
                onClick={() => setLang(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            className="nav-burger"
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? "✕" : "☰"}
            <span className="sr-only">{t("menu")}</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
