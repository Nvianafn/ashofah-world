"use client";
import Image from "next/image";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Icon } from "./Icon";
const missing = new Set(["genbi-purwokerto", "pmii-saintek", "simpus"]);
export function ProjectImage({
  src,
  name,
  slug,
  priority = false,
}: {
  src?: string;
  name: string;
  slug: string;
  priority?: boolean;
}) {
  const [broken, setBroken] = useState(false);
  const { t } = useI18n();
  return (
    <div className="project-image">
      {src && !missing.has(slug) && !broken ? (
        <Image
          src={src}
          alt={`${name} · ${t("image.preview")}`}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 400px"
          priority={priority}
          onError={() => setBroken(true)}
        />
      ) : (
        <div className={`pixel-cover cover-${slug}`}>
          <div className="pixel-server" aria-hidden="true">
            <span>
              <i />
              <i />
            </span>
            <span>
              <i />
              <i />
            </span>
            <span>
              <i />
              <i />
            </span>
          </div>
          <Icon slug="terminal" />
          <strong>{name}</strong>
          <small>{t("image.illustration")}</small>
        </div>
      )}
    </div>
  );
}
