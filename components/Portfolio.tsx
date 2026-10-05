"use client";
import { useWorld, WORLDS } from "@/lib/world";
import { useI18n } from "@/lib/i18n";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { WorldNavigation } from "./WorldNavigation";
import { Statement } from "./Statement";
import { TechStack } from "./TechStack";
import { Projects } from "./Projects";
import { Contributions } from "./Contributions";
import { HireMe } from "./HireMe";
import { Footer } from "./Footer";
import { Terminal } from "./Terminal";
import { Dialog } from "./Dialog";
export function Portfolio() {
  const { active, terminalOpen, setTerminalOpen, openWorld } = useWorld();
  const { t } = useI18n();
  return (
    <>
      <a className="skip-link" href="#world-content">
        {t("skip")}
      </a>
      <div id="top" />
      <Nav />
      <main>
        <Hero />
        <WorldNavigation />
        <div id="world-content" tabIndex={-1} className="world-content wrap">
          {WORLDS.map((world) => (
            <div
              id={world}
              key={world}
              hidden={active !== world}
              tabIndex={-1}
              className="world-panel"
              aria-label={t(`world.${world}`)}
            >
              {world === "about" ? (
                <Statement />
              ) : world === "stack" ? (
                <TechStack />
              ) : world === "projects" ? (
                <>
                  <Projects />
                  <Contributions />
                </>
              ) : (
                <HireMe />
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
      <Dialog
        open={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        title={t("terminal.title")}
        className="terminal-dialog"
      >
        <p className="eyebrow">{t("terminal.room")}</p>
        <h2>{t("terminal.title")}</h2>
        <p className="terminal-description">{t("terminal.description")}</p>
        <Terminal
          onHire={() => {
            setTerminalOpen(false);
            openWorld("contact");
          }}
        />
      </Dialog>
    </>
  );
}
