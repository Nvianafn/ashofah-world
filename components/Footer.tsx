"use client";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { BIO } from "@/lib/content";
export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="foot">
      <div className="wrap">
        <a className="footer-brand" href="#top">
          <Image
            className="footer-logo"
            src="/images/brand/dino-hood-small.svg"
            alt=""
            aria-hidden="true"
            width={24}
            height={24}
            unoptimized
          />
          <span>
            ASHOFAH<span className="footer-world"> WORLD</span>
          </span>
        </a>
        <span>
          © {new Date().getFullYear()} {BIO.name}
        </span>
        <a className="back-top" href="#top">
          {t("backTop")} ↑
        </a>
      </div>
    </footer>
  );
}
