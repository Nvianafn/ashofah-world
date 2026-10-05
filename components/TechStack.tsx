"use client";
import { useI18n } from "@/lib/i18n";
import { STACK, L } from "@/lib/content";
import { Icon } from "./Icon";
export function TechStack() {
  const { t, lang } = useI18n();
  return (
    <section aria-labelledby="inventory-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">WORLD 02 / {t("nav.stack")}</p>
          <h2 id="inventory-title">{t("world.stack")}</h2>
          <p className="section-description">{t("stackSub")}</p>
        </div>
        <span className="section-token">02</span>
      </div>
      <div className="stack-groups">
        {STACK.map((group, i) => (
          <div key={group.key} className={`stack-col inventory-${i}`}>
            <div className="inventory-header">
              <span className="inventory-icon" aria-hidden="true">
                {["{ }", "</>", "⌘"][i]}
              </span>
              <span>
                <small>
                  {t("inventory.slot")} 0{i + 1}
                </small>
                <h3>{L(group.label, lang)}</h3>
              </span>
              <span className="inventory-count">
                {String(group.items.length).padStart(2, "0")}
              </span>
            </div>
            <div className="stack-items">
              {group.items.map((item) => (
                <div className="tech" key={item.slug}>
                  <span className="logo">
                    <Icon slug={item.slug} />
                  </span>
                  <span>{item.name}</span>
                  <span
                    className="item-equipped"
                    aria-label={t("inventory.equipped")}
                  >
                    ◆
                  </span>
                </div>
              ))}
            </div>
            <p className="inventory-footer">
              {group.items.length} {t("inventory.tools")}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
