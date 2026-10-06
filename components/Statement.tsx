"use client";
import { useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { BIO, SOCIALS, L } from "@/lib/content";
import { PixelCharacter } from "./PixelCharacter";
export function Statement() {
  const { lang, t } = useI18n();
  const [showPhoto, setShowPhoto] = useState(false);
  return (
    <section className="profile-world" aria-labelledby="profile-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">WORLD 01 / {t("nav.about")}</p>
          <h2 id="profile-title">{t("world.about")}</h2>
        </div>
        <span className="section-token">01</span>
      </div>
      <div className="profile-grid">
        <div className="handheld">
          <div className="console-top">
            <span>ASHOFAH®</span>
            <span>PLAYER EDITION</span>
          </div>
          <div className={`console-screen${showPhoto ? " console-screen--photo" : ""}`}>
            <span className="screen-label">PLAYER 01</span>
            <button
              type="button"
              className="profile-avatar-toggle"
              aria-label={t("profile.togglePhoto")}
              aria-pressed={showPhoto}
              aria-describedby="profile-avatar-hint"
              onClick={() => setShowPhoto((visible) => !visible)}
            >
              {showPhoto ? (
                <Image
                  src="/images/profile/affan.jpg"
                  alt={`${t("profile.photo")} ${BIO.name}`}
                  width={720}
                  height={1280}
                  className="profile-player-photo"
                  unoptimized
                />
              ) : (
                <PixelCharacter pose="wave" />
              )}
            </button>
            <span className="screen-name">AFFAN</span>
            <span className="screen-status">● {L(BIO.availability, lang)}</span>
          </div>
          <p className="profile-avatar-hint" id="profile-avatar-hint">
            <span className="profile-hint-mouse">
              {t(showPhoto ? "profile.backToDino" : "profile.showPhoto")}
            </span>
            <span className="profile-hint-touch">
              {t(showPhoto ? "profile.backToDinoTouch" : "profile.showPhotoTouch")}
            </span>
            <span className="profile-hint-keyboard">
              {t("profile.keyboardHint")}
            </span>
          </p>
          <div className="console-controls">
            <span className="dpad" aria-hidden="true">
              ✚
            </span>
            <span className="console-speaker" aria-hidden="true">
              ▥
            </span>
            <span className="console-buttons" aria-hidden="true">
              <i />
              <i />
            </span>
          </div>
        </div>
        <div className="profile-copy">
          <span className="profile-greeting">{t("profile.hello")}</span>
          <h3>
            {BIO.name}
            <span> @{BIO.handle}</span>
          </h3>
          <p className="profile-role">{L(BIO.role, lang)}</p>
          <p>{L(BIO.bio, lang)}</p>
          <div className="profile-meta">
            {BIO.meta.map(
              (m: { value: string; label: { en: string; id: string } }) => (
                <div key={m.value}>
                  <small>{L(m.label, lang)}</small>
                  <strong>{m.value}</strong>
                </div>
              ),
            )}
          </div>
          <blockquote>
            {L(BIO.statement.lead, lang)} <em>{L(BIO.statement.tail, lang)}</em>
          </blockquote>
          <p className="profile-philosophy">{L(BIO.statement.sub, lang)}</p>
          <a
            className="text-link"
            href={SOCIALS.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </section>
  );
}
