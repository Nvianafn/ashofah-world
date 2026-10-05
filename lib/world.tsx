"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
export const WORLDS = ["about", "stack", "projects", "contact"] as const;
export type World = (typeof WORLDS)[number];
type WorldState = {
  active: World;
  visited: World[];
  openWorld: (world: World, scroll?: boolean) => void;
  terminalOpen: boolean;
  setTerminalOpen: (open: boolean) => void;
  sound: boolean;
  toggleSound: () => void;
  playSound: (kind?: "jump" | "world") => void;
};
const WorldContext = createContext<WorldState | null>(null);
export function WorldProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<World>("about");
  const [visited, setVisited] = useState<World[]>([]);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [sound, setSound] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const openWorld = useCallback((world: World, scroll = true) => {
    setActive(world);
    setVisited((previous) =>
      previous.includes(world) ? previous : [...previous, world],
    );
    if (window.location.hash !== `#${world}`)
      window.history.pushState(null, "", `#${world}`);
    if (scroll)
      requestAnimationFrame(() => {
        const panel = document.getElementById(world);
        panel?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
          block: "start",
        });
        panel?.focus({ preventScroll: true });
      });
  }, []);
  useEffect(() => {
    const readHash = () => {
      const hash = window.location.hash.slice(1);
      if (WORLDS.includes(hash as World)) openWorld(hash as World);
    };
    readHash();
    window.addEventListener("hashchange", readHash);
    window.addEventListener("popstate", readHash);
    return () => {
      window.removeEventListener("hashchange", readHash);
      window.removeEventListener("popstate", readHash);
    };
  }, [openWorld]);
  const playSound = useCallback(
    (kind: "jump" | "world" = "world") => {
      if (!sound || !audio.current) return;
      const context = audio.current;
      void context.resume();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(
        kind === "jump" ? 220 : 660,
        context.currentTime,
      );
      oscillator.frequency.exponentialRampToValueAtTime(
        kind === "jump" ? 660 : 880,
        context.currentTime + 0.12,
      );
      gain.gain.setValueAtTime(0.035, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.16);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.17);
    },
    [sound],
  );
  const toggleSound = () => {
    if (!sound && !audio.current) audio.current = new AudioContext();
    if (!sound) void audio.current?.resume();
    setSound(!sound);
  };
  useEffect(
    () => () => {
      void audio.current?.close();
    },
    [],
  );
  return (
    <WorldContext.Provider
      value={{
        active,
        visited,
        openWorld,
        terminalOpen,
        setTerminalOpen,
        sound,
        toggleSound,
        playSound,
      }}
    >
      {children}
    </WorldContext.Provider>
  );
}
export function useWorld() {
  const context = useContext(WorldContext);
  if (!context) throw new Error("WorldProvider is required");
  return context;
}
