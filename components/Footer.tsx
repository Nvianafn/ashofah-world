"use client";
import { useI18n } from "@/lib/i18n";
import { BIO } from "@/lib/content";
export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="foot">
      <div className="wrap">
        <a className="footer-brand" href="#top">
          ASHOFAH<span> WORLD</span>
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
