"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Lang } from "./content";

type Strings = Record<string, string>;

export const UI: Record<Lang, Strings> = {
  en: {
    "nav.about": "Player / About",
    "nav.stack": "Inventory / Stack",
    "nav.projects": "Quests / Projects",
    "nav.contact": "Contact",
    navigation: "Main navigation",
    language: "Language",
    "cta.work": "View projects",
    stackSub:
      "The tools in my backpack. Built for APIs, the web, and everything keeping them running.",
    projSub:
      "Real projects. Real challenges. Six quests built and shipped, one commit at a time.",
    contribH: "Activity Log",
    contribSub:
      "A look behind the quests. Public GitHub activity over the last year.",
    contribTotal: "contributions in this period",
    less: "less",
    more: "more",
    hireH: "Let’s build the next level.",
    hireP:
      "Open to backend and DevOps roles, freelance, and collaborations. Have a challenge in mind? Let’s talk.",
    menu: "Menu",
    inProgress: "In progress",
    shipped: "Shipped",
    live: "Live",
    techUsed: "Tools used",
    preview: "Explore quest",
    close: "Close",
    backTop: "Back to start",
    skip: "Skip to portfolio",
    "world.about": "Player Profile",
    "world.stack": "Skill Inventory",
    "world.projects": "Project Quests",
    "world.contact": "Next Checkpoint",
    "world.select": "CHOOSE YOUR WORLD",
    "world.noGame": "Explore at your own pace. No game skills needed.",
    "world.visited": "Visited",
    "world.unvisited": "Not visited yet",
    "world.open": "Open world",
    "world.found": "WORLDS FOUND",
    "game.start": "Start Adventure",
    "game.continue": "Continue Adventure",
    "game.intro": "A little adventure. A lot of backend.",
    "game.instructions":
      "Move with ← → or A D. Jump with Space. Hit a block to explore.",
    "game.arena": "Interactive portfolio arena",
    "game.move": "move",
    "game.jump": "jump",
    "game.click": "or click a block to explore",
    "game.left": "Move left",
    "game.right": "Move right",
    "game.about": "PLAYER",
    "game.stack": "INVENTORY",
    "game.projects": "QUESTS",
    "game.contact": "CONTACT",
    "game.caption": "A world built one commit at a time.",
    sound: "SOUND",
    on: "ON",
    off: "OFF",
    "profile.hello": "Hey, I’m Affan. Your player for this adventure.",
    "inventory.slot": "ITEM CATEGORY",
    "inventory.equipped": "Equipped tool",
    "inventory.tools": "tools equipped",
    "contact.next": "NEXT CHECKPOINT",
    "contact.adventure": "The next adventure starts with a hello.",
    "contact.email": "Let’s talk",
    "contact.unverified": "Profile unverified",
    "activity.loading": "Loading real GitHub activity…",
    "activity.unavailable":
      "GitHub activity is unavailable right now. No estimated activity is shown.",
    "activity.retry": "Try again",
    "activity.github": "View GitHub profile",
    "activity.graph": "GitHub contributions over the last year",
    "activity.period": "Period",
    "image.illustration": "Illustration · Screenshot coming soon",
    "image.preview": "Project screenshot",
    "carousel.previous": "Previous screenshot",
    "carousel.next": "Next screenshot",
    "carousel.slide": "Screenshot",
    "terminal.open": "Open secret terminal",
    "terminal.label": "SECRET PIPE",
    "terminal.room": "BONUS ROOM / DEVELOPER TERMINAL",
    "terminal.title": "Welcome to the underground.",
    "terminal.description":
      "Explore the filesystem, discover projects, or try sudo hire-me.",
    "terminal.input": "Terminal command",
  },
  id: {
    "nav.about": "Player / Profil",
    "nav.stack": "Inventory / Stack",
    "nav.projects": "Quests / Proyek",
    "nav.contact": "Kontak",
    navigation: "Navigasi utama",
    language: "Bahasa",
    "cta.work": "Lihat proyek",
    stackSub:
      "Alat di dalam ransel gua. Untuk API, web, dan semua yang bikin sistem tetap jalan.",
    projSub:
      "Proyek nyata. Tantangan nyata. Enam quest yang gua bangun, satu commit pada satu waktu.",
    contribH: "Log Aktivitas",
    contribSub:
      "Di balik quest. Aktivitas GitHub publik selama setahun terakhir.",
    contribTotal: "kontribusi pada periode ini",
    less: "sedikit",
    more: "banyak",
    hireH: "Ayo bangun level berikutnya.",
    hireP:
      "Terbuka untuk peran backend dan DevOps, freelance, dan kolaborasi. Punya tantangan yang menarik? Yuk, ngobrol.",
    menu: "Menu",
    inProgress: "Dalam pengerjaan",
    shipped: "Selesai",
    live: "Aktif",
    techUsed: "Alat yang dipakai",
    preview: "Jelajahi quest",
    close: "Tutup",
    backTop: "Kembali ke awal",
    skip: "Langsung ke portfolio",
    "world.about": "Profil Player",
    "world.stack": "Inventory Skill",
    "world.projects": "Quest Proyek",
    "world.contact": "Checkpoint Berikutnya",
    "world.select": "PILIH WORLD KAMU",
    "world.noGame": "Jelajahi sesukamu. Nggak perlu jago main game.",
    "world.visited": "Sudah dikunjungi",
    "world.unvisited": "Belum dikunjungi",
    "world.open": "Buka world",
    "world.found": "WORLD DITEMUKAN",
    "game.start": "Mulai Petualangan",
    "game.continue": "Lanjut Petualangan",
    "game.intro": "Sedikit petualangan. Banyak cerita backend.",
    "game.instructions":
      "Gerak dengan ← → atau A D. Lompat dengan Space. Sentuh blok untuk menjelajah.",
    "game.arena": "Arena portfolio interaktif",
    "game.move": "gerak",
    "game.jump": "lompat",
    "game.click": "atau klik blok untuk menjelajah",
    "game.left": "Gerak ke kiri",
    "game.right": "Gerak ke kanan",
    "game.about": "PLAYER",
    "game.stack": "INVENTORY",
    "game.projects": "QUEST",
    "game.contact": "KONTAK",
    "game.caption": "Dunia yang dibangun satu commit pada satu waktu.",
    sound: "SUARA",
    on: "ON",
    off: "OFF",
    "profile.hello": "Halo, gua Affan. Player kamu di petualangan ini.",
    "inventory.slot": "KATEGORI ITEM",
    "inventory.equipped": "Alat tersedia",
    "inventory.tools": "alat tersedia",
    "contact.next": "CHECKPOINT BERIKUTNYA",
    "contact.adventure": "Petualangan berikutnya dimulai dari sapaan.",
    "contact.email": "Yuk, ngobrol",
    "contact.unverified": "Profil belum diverifikasi",
    "activity.loading": "Memuat aktivitas GitHub asli…",
    "activity.unavailable":
      "Aktivitas GitHub belum tersedia. Tidak ada estimasi aktivitas yang ditampilkan.",
    "activity.retry": "Coba lagi",
    "activity.github": "Lihat profil GitHub",
    "activity.graph": "Kontribusi GitHub selama setahun terakhir",
    "activity.period": "Periode",
    "image.illustration": "Ilustrasi · Screenshot menyusul",
    "image.preview": "Screenshot proyek",
    "carousel.previous": "Screenshot sebelumnya",
    "carousel.next": "Screenshot berikutnya",
    "carousel.slide": "Screenshot",
    "terminal.open": "Buka terminal rahasia",
    "terminal.label": "PIPA RAHASIA",
    "terminal.room": "RUANG BONUS / TERMINAL DEVELOPER",
    "terminal.title": "Selamat datang di bawah tanah.",
    "terminal.description":
      "Jelajahi filesystem, temukan proyek, atau coba sudo hire-me.",
    "terminal.input": "Perintah terminal",
  },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string };
const I18nCtx = createContext<Ctx>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang") as Lang | null;
      if (saved === "en" || saved === "id") setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
    } catch {}
  };

  const t = (k: string) => UI[lang][k] ?? k;
  const value = { lang, setLang, t };

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  return useContext(I18nCtx);
}
