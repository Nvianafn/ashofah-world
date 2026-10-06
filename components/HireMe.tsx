"use client";
import { useI18n } from "@/lib/i18n";
import { BIO, SOCIALS, L } from "@/lib/content";
import { PixelCharacter } from "./PixelCharacter";
export function HireMe() {
  const { t, lang } = useI18n();
  return (
    <section aria-labelledby="contact-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">WORLD 04 / {t("nav.contact")}</p>
          <h2 id="contact-title">{t("world.contact")}</h2>
        </div>
        <span className="section-token">04</span>
      </div>
      <div className="contact-grid">
        <div className="contact-scene">
          <span className="checkpoint-banner">{t("contact.next")}</span>
          <div className="finish-flag" aria-hidden="true">
            <span>★</span>
          </div>
          <PixelCharacter pose="wave" />
          <div className="contact-grass" />
          <span className="contact-scene-label">{t("contact.adventure")}</span>
        </div>
        <div className="contact-copy">
          <span className="avail">
            <i />
            {L(BIO.availability, lang)}
          </span>
          <h3>{t("hireH")}</h3>
          <p>{t("hireP")}</p>
          <a
            className="btn btn-primary email-button"
            href={`mailto:${SOCIALS.email}`}
          >
            {t("contact.email")} <span>↗</span>
          </a>
          <a className="contact-email" href={`mailto:${SOCIALS.email}`}>
            {SOCIALS.email}
          </a>
          <div className="contact-socials">
            <a href={SOCIALS.github} target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
            {SOCIALS.linkedin && (
              <a
                href={SOCIALS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn ↗ <small>{t("contact.unverified")}</small>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
