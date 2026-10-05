"use client";
import { useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { ProjectImage } from "./ProjectImage";
export type Slide = { src: string; label: string };
export function Carousel({ slides, slug }: { slides: Slide[]; slug: string }) {
  const [index, setIndex] = useState(0);
  const { t } = useI18n();
  const touch = useRef<number | null>(null);
  const go = (direction: number) =>
    setIndex((i) => (i + direction + slides.length) % slides.length);
  const slide = slides[index];
  return (
    <div
      className="carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={t("image.preview")}
      onTouchStart={(e) => {
        touch.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touch.current !== null) {
          const distance = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(distance) > 45) go(distance > 0 ? -1 : 1);
          touch.current = null;
        }
      }}
    >
      <div className="quest-window">
        <span>{slide.label}</span>
        <span aria-hidden="true">− □ ×</span>
      </div>
      <ProjectImage
        key={slide.src}
        src={slide.src}
        name={slide.label}
        slug={slug}
        priority
      />
      <div className="carousel-controls">
        <button
          onClick={() => go(-1)}
          disabled={slides.length < 2}
          aria-label={t("carousel.previous")}
        >
          ←
        </button>
        <div className="carousel-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={i === index ? "active" : ""}
              aria-label={`${t("carousel.slide")} ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <button
          onClick={() => go(1)}
          disabled={slides.length < 2}
          aria-label={t("carousel.next")}
        >
          →
        </button>
      </div>
      <p className="carousel-count" aria-live="polite">
        {t("carousel.slide")} {index + 1} / {slides.length}
      </p>
    </div>
  );
}
