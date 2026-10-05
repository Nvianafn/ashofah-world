"use client";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { SOCIALS } from "@/lib/content";
type Day = { date: string; count: number; level: number };
export function Contributions() {
  const { t } = useI18n();
  const [days, setDays] = useState<Day[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let alive = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    setState("loading");
    fetch(
      `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(SOCIALS.githubUser)}?y=last`,
      { signal: controller.signal },
    )
      .then(async (response) => {
        if (!response.ok) throw new Error("Activity unavailable");
        return response.json();
      })
      .then((data) => {
        if (
          !Array.isArray(data.contributions) ||
          !data.contributions.length ||
          !data.contributions.every(
            (day: Day) =>
              typeof day.date === "string" &&
              Number.isInteger(day.count) &&
              day.count >= 0 &&
              Number.isInteger(day.level) &&
              day.level >= 0 &&
              day.level <= 4,
          )
        )
          throw new Error("Invalid activity data");
        if (alive) {
          setDays(data.contributions.slice(-371));
          setState("ready");
        }
      })
      .catch(() => {
        if (alive) {
          setDays([]);
          setState("error");
        }
      })
      .finally(() => clearTimeout(timeout));
    return () => {
      alive = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [attempt]);
  return (
    <section className="activity-log" aria-labelledby="activity-title">
      <div className="activity-title">
        <span aria-hidden="true">▥</span>
        <div>
          <h2 id="activity-title">{t("contribH")}</h2>
          <p>{t("contribSub")}</p>
        </div>
        <a href={SOCIALS.github} target="_blank" rel="noopener noreferrer">
          @{SOCIALS.githubUser} ↗
        </a>
      </div>
      <div className="contrib-card" aria-live="polite">
        {state === "ready" ? (
          <>
            <div className="contrib-head">
              <span>
                <b>
                  {days
                    .reduce((sum, day) => sum + day.count, 0)
                    .toLocaleString()}
                </b>{" "}
                {t("contribTotal")}
              </span>
              <small>
                {t("activity.period")}: {days[0].date} —{" "}
                {days[days.length - 1].date}
              </small>
            </div>
            <div className="graph" role="img" aria-label={t("activity.graph")}>
              {days.map((day) => (
                <span
                  key={day.date}
                  className={`cell l${day.level}`}
                  title={`${day.date}: ${day.count}`}
                />
              ))}
            </div>
            <div className="contrib-legend">
              {t("less")}
              {[0, 1, 2, 3, 4].map((level) => (
                <i key={level} className={`cell l${level}`} />
              ))}
              {t("more")}
            </div>
          </>
        ) : (
          <div className="activity-message">
            <span>
              {state === "loading"
                ? t("activity.loading")
                : t("activity.unavailable")}
            </span>
            {state === "error" && (
              <button className="btn" onClick={() => setAttempt((a) => a + 1)}>
                {t("activity.retry")}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
