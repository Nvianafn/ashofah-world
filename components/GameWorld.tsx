"use client";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { useI18n } from "@/lib/i18n";
import { WORLDS, useWorld, type World } from "@/lib/world";
import { PixelCharacter } from "./PixelCharacter";

const BLOCKS = [235, 410, 585, 760];
const PIPE_X = 940;
export function GameWorld({
  arenaRef,
  started,
  onStart,
}: {
  arenaRef: RefObject<HTMLDivElement>;
  started: boolean;
  onStart: () => void;
}) {
  const { t } = useI18n();
  const { openWorld, visited, setTerminalOpen, playSound } = useWorld();
  const [pose, setPose] = useState({ x: 100, y: 0, facing: 1, moving: false });
  const [bumped, setBumped] = useState<World | null>(null);
  const [burst, setBurst] = useState<World | null>(null);
  const [coins, setCoins] = useState<World[]>([]);
  const awarded = useRef(new Set<World>());
  const inner = useRef<HTMLDivElement>(null);
  const pipe = useRef<HTMLButtonElement>(null);
  const player = useRef<HTMLDivElement>(null);
  const physics = useRef({ x: 100, y: 0, velocity: 0, facing: 1, grounded: true });
  const pipeBounds = useCallback(() => {
    const width = inner.current?.clientWidth || 1000;
    const half = ((pipe.current?.offsetWidth || 74) / width) * 500;
    return {
      left: PIPE_X - half,
      right: PIPE_X + half,
      height: pipe.current?.offsetHeight || 84,
      playerHalf: ((player.current?.offsetWidth || 48) / width) * 500,
    };
  }, []);
  const keys = useRef(new Set<string>());
  const frame = useRef<number | null>(null);
  const last = useRef(0);
  const latest = useRef({ openWorld, playSound });
  latest.current = { openWorld, playSound };
  const hit = (world: World) => {
    setBumped(world);
    if (!awarded.current.has(world)) {
      awarded.current.add(world);
      setCoins(Array.from(awarded.current));
      setBurst(world);
    }
    latest.current.playSound();
    latest.current.openWorld(world);
  };
  const hitRef = useRef(hit);
  hitRef.current = hit;
  useEffect(() => {
    if (!bumped) return;
    const timer = setTimeout(() => setBumped(null), 350);
    return () => clearTimeout(timer);
  }, [bumped]);
  useEffect(() => {
    if (!burst) return;
    const timer = setTimeout(() => setBurst(null), 850);
    return () => clearTimeout(timer);
  }, [burst]);
  const tickRef = useRef<(now: number) => void>(() => {});
  tickRef.current = (now) => {
    // A callback queued during a frame can receive a timestamp preceding wake().
    // Clamp both ends so the first jump step never moves backwards into the floor.
    const dt = Math.max(0.001, Math.min((now - last.current) / 1000 || 0.016, 0.033));
    last.current = now;
    const p = physics.current;
    const bounds = pipeBounds();
    const previousX = p.x;
    const previousY = p.y;
    const direction =
      Number(keys.current.has("right")) - Number(keys.current.has("left"));
    if (direction) {
      p.x = Math.max(24, Math.min(970, p.x + direction * 220 * dt));
      p.facing = direction;
    }
    // Coordinates along the level are normalized; object sizes remain real CSS pixels.
    if (p.y < bounds.height && p.y + 64 > 0) {
      if (previousX <= bounds.left - bounds.playerHalf && p.x > bounds.left - bounds.playerHalf)
        p.x = bounds.left - bounds.playerHalf;
      if (previousX >= bounds.right + bounds.playerHalf && p.x < bounds.right + bounds.playerHalf)
        p.x = bounds.right + bounds.playerHalf;
    }
    const overPipe = p.x + bounds.playerHalf > bounds.left && p.x - bounds.playerHalf < bounds.right;
    const support = overPipe && p.y >= bounds.height - 0.01 ? bounds.height : 0;
    if (p.grounded && Math.abs(p.y - support) > 0.01) p.grounded = false;
    const previousTop = p.y + 64;
    if (!p.grounded) {
      p.y += p.velocity * dt;
      p.velocity -= 1400 * dt;
    }
    if (p.velocity <= 0 && overPipe && previousY >= bounds.height && p.y <= bounds.height) {
      p.y = bounds.height;
      p.velocity = 0;
      p.grounded = true;
    }
    if (p.velocity > 0 && previousTop <= 112 && p.y + 64 >= 112) {
      const block = BLOCKS.findIndex((x) => Math.abs(x - p.x) < 38);
      if (block !== -1) {
        p.y = 48;
        p.velocity = -30;
        keys.current.clear();
        hitRef.current(WORLDS[block]);
      }
    }
    if (p.y <= 0) {
      p.y = 0;
      p.velocity = 0;
      p.grounded = true;
    }
    setPose({ x: p.x, y: p.y, facing: p.facing, moving: !!direction });
    if (keys.current.size || !p.grounded)
      frame.current = requestAnimationFrame((time) => tickRef.current(time));
    else {
      frame.current = null;
      last.current = 0;
    }
  };
  const wake = () => {
    if (frame.current === null) {
      last.current = performance.now();
      frame.current = requestAnimationFrame((time) => tickRef.current(time));
    }
  };
  const stop = useCallback(() => {
    keys.current.clear();
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    last.current = 0;
    const p = physics.current;
    const bounds = pipeBounds();
    const overPipe = p.x + bounds.playerHalf > bounds.left && p.x - bounds.playerHalf < bounds.right;
    p.y = overPipe && p.y >= bounds.height ? bounds.height : 0;
    p.velocity = 0;
    p.grounded = true;
    setPose((pose) => ({ ...pose, y: p.y, moving: false }));
  }, [pipeBounds]);
  useEffect(() => {
    const pause = () => {
      if (document.hidden) stop();
    };
    window.addEventListener("blur", stop);
    document.addEventListener("visibilitychange", pause);
    return () => {
      window.removeEventListener("blur", stop);
      document.removeEventListener("visibilitychange", pause);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [stop]);
  const move = (direction: "left" | "right") => {
    onStart();
    keys.current.add(direction);
    wake();
  };
  const jump = () => {
    onStart();
    if (physics.current.grounded) {
      physics.current.grounded = false;
      physics.current.velocity = 520;
      latest.current.playSound("jump");
      wake();
    }
  };
  const enterPipe = () => {
    const p = physics.current;
    const bounds = pipeBounds();
    if (p.grounded && p.y === bounds.height && Math.abs(p.x - PIPE_X) < (bounds.right - bounds.left) / 2)
      setTerminalOpen(true);
  };
  const release = (direction: string) => keys.current.delete(direction);
  const controls = useRef({ move, jump, release, enterPipe });
  controls.current = { move, jump, release, enterPipe };
  useEffect(() => {
    const keyDown = (event: KeyboardEvent) => {
      if (!started || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, button, a, [contenteditable], [role='textbox'], [role='button']") || document.querySelector("dialog[open]")) return;
      const arena = arenaRef.current;
      if (!arena) return;
      const rect = arena.getBoundingClientRect();
      const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      // Resume only when the player has returned to the visible level.
      if (visible < Math.min(rect.height * 0.4, 100)) return;
      const key = event.key.toLowerCase();
      if (!["arrowleft", "arrowright", "a", "d", " ", "arrowdown"].includes(key)) return;
      event.preventDefault();
      arena.focus({ preventScroll: true });
      if (key === " ") {
        if (!event.repeat) controls.current.jump();
      } else if (key === "arrowdown") controls.current.enterPipe();
      else controls.current.move(key === "arrowleft" || key === "a" ? "left" : "right");
    };
    const keyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (["arrowleft", "a"].includes(key)) controls.current.release("left");
      if (["arrowright", "d"].includes(key)) controls.current.release("right");
    };
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, [started, arenaRef]);
  return (
    <>
      <div
        className="game-arena"
        ref={arenaRef}
        tabIndex={0}
        role="region"
        aria-label={t("game.arena")}
        aria-describedby="game-help"
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) stop();
        }}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget || !started) return;
          const key = e.key.toLowerCase();
          if (["arrowleft", "arrowright", "a", "d", " "].includes(key)) {
            e.preventDefault();
            if (key === " " && !e.repeat) jump();
            else if (key !== " ")
              move(key === "arrowleft" || key === "a" ? "left" : "right");
          } else if (key === "arrowdown") {
            e.preventDefault();
            enterPipe();
          }
        }}
        onKeyUp={(e) => {
          if (e.target !== e.currentTarget) return;
          const key = e.key.toLowerCase();
          if (["arrowleft", "a"].includes(key)) release("left");
          if (["arrowright", "d"].includes(key)) release("right");
        }}
      >
        <svg
          className="landscape"
          viewBox="0 0 1440 310"
          preserveAspectRatio="none"
          aria-hidden="true"
          shapeRendering="crispEdges"
        >
          <path
            fill="#342849"
            d="M0 210h80v-30h40v-25h40v-30h110v30h60v25h80v30h95v-25h60v-30h70v-35h70v-20h110v30h70v25h60v35h120v-20h60v-30h60v-35h70v-25h90v30h60v30h60v30h85v30H0z"
          />
          <path
            fill="#2c2943"
            d="M0 220h50v-20h70v-20h100v20h60v30h120v-20h80v-25h90v-20h130v25h70v30h130v-20h90v-30h110v30h80v30h120v-20h60v-25h100v25h60v15h90v70H0z"
          />
          <path
            fill="#383748"
            d="M0 250h70v-20h35v-20h90v20h40v20h80v-15h60v-20h85v20h70v15h80v-10h80v-20h90v20h70v10h80v-25h55v-15h90v15h60v25h120v-20h55v-20h70v20h60v20h90v-15h60v65H0z"
          />
          <path
            fill="#f4dfab"
            d="M1220 27h36v9h12v36h-12v9h-36v-9h-12V36h12z"
          />
          <path fill="#3b2a54" d="M1235 27h21v9h12v20h-22V45h-11z" />
          <path
            fill="#73618b"
            opacity=".5"
            d="M65 70h25V58h50v12h25v12h20v16H45V82h20zm260 55h20v-12h50v12h25v12h15v12H305v-12h20zm690-12h25v-12h50v12h25v12h25v12H990v-12h25z"
          />
        </svg>
        <div className="arena-inner wrap" ref={inner}>
          <span className="coin-counter" role="status" aria-live="polite">
            <span className="coin" aria-hidden="true" /> {t("game.coins")} {coins.length}/04
          </span>
          <span className="spawn-label" aria-hidden="true">
            AFFAN <span>↓</span>
          </span>
          {WORLDS.map((world, i) => (
            <div
              className="checkpoint"
              key={world}
              style={{ left: `${BLOCKS[i] / 10}%` }}
            >
              {burst === world && <span className="coin coin-burst" aria-hidden="true" />}
              <button
                className={`question-block ${visited.includes(world) ? "collected" : ""} ${bumped === world ? "bump" : ""}`}
                aria-label={`${t("world.open")} 0${i + 1}: ${t(`world.${world}`)}`}
                onClick={() => hit(world)}
              >
                {visited.includes(world) ? "✓" : "?"}
              </button>
              <span className="checkpoint-label">
                0{i + 1} · {t(`game.${world}`)}
              </span>
            </div>
          ))}
          <div
            ref={player}
            className={`game-player ${pose.moving ? "running" : ""} ${pose.y > 0 ? "jumping" : ""}`}
            style={{
              left: `${pose.x / 10}%`,
              bottom: `${48 + pose.y}px`,
              transform: `translateX(-50%) scaleX(${pose.facing})`,
            }}
          >
            <PixelCharacter pose={!physics.current.grounded ? "jump" : pose.moving ? "walk" : started ? "idle" : "wave"} />
          </div>
          <button
            ref={pipe}
            className="secret-pipe"
            style={{ left: `${PIPE_X / 10}%` }}
            aria-label={t("terminal.open")}
            onClick={() => setTerminalOpen(true)}
          >
            <span className="pipe-label">
              {t("terminal.label")} <span>↓</span>
            </span>
            <span className="pipe-rim" />
            <span className="pipe-body" />
            <span className="pipe-symbol" aria-hidden="true">
              &gt;_
            </span>
          </button>
          <div className="pixel-bush bush-one" aria-hidden="true" />
          <div className="pixel-bush bush-two" aria-hidden="true" />
        </div>
        <div className="ground" aria-hidden="true">
          <div className="grass" />
        </div>
      </div>
      <div className="game-controls wrap">
        <p id="game-help">
          <kbd>←</kbd>
          <kbd>→</kbd> / <kbd>A</kbd>
          <kbd>D</kbd> {t("game.move")} <span>·</span> <kbd>SPACE</kbd>{" "}
          {t("game.jump")} <span>·</span> {t("game.click")}
        </p>
        <div className="touch-controls">
          {(["left", "jump", "right", "down"] as const).map((direction) => (
            <button
              key={direction}
              aria-label={t(`game.${direction}`)}
              onPointerDown={(e) => {
                e.preventDefault();
                e.currentTarget.setPointerCapture(e.pointerId);
                if (direction === "down") enterPipe();
                else if (direction === "jump") jump();
                else move(direction);
              }}
              onPointerUp={() => release(direction)}
              onPointerCancel={() => release(direction)}
              onLostPointerCapture={() => release(direction)}
              onKeyDown={(e) => {
                if (["Enter", " "].includes(e.key)) {
                  e.preventDefault();
                  if (direction === "down") enterPipe();
                  else if (direction === "jump") jump();
                  else move(direction);
                }
              }}
              onKeyUp={() => release(direction)}
              onBlur={() => release(direction)}
            >
              {direction === "left" ? "←" : direction === "jump" ? "↑" : direction === "down" ? "↓" : "→"}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
