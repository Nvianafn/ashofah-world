"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { BIO, PROJECTS, SOCIALS, L } from "@/lib/content";
import { buildFS, FsDir, FsNode } from "@/lib/filesystem";
import { Icon } from "./Icon";

function esc(s: string) {
  return String(s).replace(/[&<>]/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : "&gt;",
  );
}

export function Terminal({ onHire }: { onHire?: () => void }) {
  const { lang, t } = useI18n();
  const FS = useMemo(() => buildFS(lang), [lang]);
  const [lines, setLines] = useState<string[]>([]);
  const [value, setValue] = useState("");
  const cwd = useRef<string[]>([]);
  const history = useRef<string[]>([]);
  const hIdx = useRef(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const user = SOCIALS.githubUser.toLowerCase();
  const mk = (h: string) => ({ __html: h });

  const nodeAt = (parts: string[]): FsNode | null => {
    let n: FsNode = FS;
    for (const p of parts) {
      if (n.type !== "dir" || !n.children[p]) return null;
      n = n.children[p];
    }
    return n;
  };
  const cwdStr = () =>
    "~" + (cwd.current.length ? "/" + cwd.current.join("/") : "");
  const promptHTML = () =>
    '<span class="prompt-arrow">\u279C</span> <span class="prompt-path">' +
    esc(cwdStr()) +
    '</span> <span class="prompt-git">git:(</span><span class="prompt-branch">main</span><span class="prompt-git">)</span> ';

  const resolveTarget = (arg?: string) => {
    let parts: string[];
    if (arg === "~" || arg === undefined || arg === "") parts = [];
    else if (arg[0] === "/") parts = arg.split("/").filter(Boolean);
    else parts = cwd.current.concat(arg.split("/").filter(Boolean));
    const out: string[] = [];
    for (const seg of parts) {
      if (seg === ".") continue;
      if (seg === "..") out.pop();
      else out.push(seg);
    }
    return { parts: out, node: nodeAt(out) };
  };

  // buffer collects output lines for a single command run
  let buf: string[] = [];
  const push = (html: string, cls?: string) =>
    buf.push(
      '<div class="term-line' + (cls ? " " + cls : "") + '">' + html + "</div>",
    );
  const pushText = (arr: string[]) => arr.forEach((l) => push(esc(l)));

  const COMMANDS: Record<string, (args: string[]) => void> = {
    help: () => {
      const rows: [string, string][] = [
        [
          "help",
          lang === "id" ? "tampilkan daftar perintah" : "show this list",
        ],
        [
          "ls [-la]",
          lang === "id"
            ? "daftar file (a: tampilkan file tersembunyi)"
            : "list files (a: show hidden)",
        ],
        [
          "cd <dir>",
          lang === "id"
            ? "pindah direktori (.. dan ~ tersedia)"
            : "change directory (.. and ~ work)",
        ],
        ["cat <file>", lang === "id" ? "baca isi file" : "print a file"],
        [
          "pwd",
          lang === "id"
            ? "tampilkan direktori saat ini"
            : "print working directory",
        ],
        [
          "tree",
          lang === "id"
            ? "tampilkan struktur filesystem"
            : "show the whole tree",
        ],
        [
          "open <project>",
          lang === "id" ? "buka tautan proyek" : "open a project link",
        ],
        ["whoami", lang === "id" ? "kenalan dengan player" : "who is this"],
        ["clear", lang === "id" ? "bersihkan layar" : "clear the screen"],
        [
          "sudo hire-me",
          lang === "id" ? "akhir yang bagus" : "the good ending",
        ],
      ];
      push(
        '<span class="t-dim">' +
          (lang === "id" ? "perintah tersedia" : "available commands") +
          "</span>",
      );
      rows.forEach((r) =>
        push(
          '  <span class="t-green">' +
            r[0] +
            "</span>" +
            "&nbsp;".repeat(Math.max(1, 16 - r[0].length)) +
            '<span class="t-dim">' +
            r[1] +
            "</span>",
        ),
      );
    },
    ls: (args) => {
      const showHidden = args.some((a) => a[0] === "-" && a.includes("a"));
      const target = args.filter((a) => a[0] !== "-")[0];
      const res = resolveTarget(target);
      if (!res.node)
        return push("ls: no such directory: " + esc(target || ""), "t-red");
      if (res.node.type !== "dir")
        return push('<span class="t-cyan">' + esc(target) + "</span>");
      let names = Object.keys(res.node.children).filter(
        (k) =>
          showHidden ||
          !res.node!.type ||
          !(res.node as FsDir).children[k].hidden,
      );
      if (showHidden) names = [".", ".."].concat(names);
      const dir = res.node as FsDir;
      const out = names
        .map((k) => {
          if (k === "." || k === "..")
            return '<span class="t-blue">' + k + "</span>";
          const ch = dir.children[k];
          return ch && ch.type === "dir"
            ? '<span class="t-blue">' + k + "/</span>"
            : '<span class="t-cyan">' + k + "</span>";
        })
        .join("&nbsp;&nbsp;&nbsp;");
      push(out);
    },
    cd: (args) => {
      const res = resolveTarget(args[0] || "~");
      if (!res.node)
        return push("cd: no such directory: " + esc(args[0] || ""), "t-red");
      if (res.node.type !== "dir")
        return push("cd: not a directory: " + esc(args[0]), "t-red");
      cwd.current = res.parts;
    },
    cat: (args) => {
      if (!args[0]) return push("cat: missing file operand", "t-red");
      const res = resolveTarget(args[0]);
      if (!res.node) return push("cat: no such file: " + esc(args[0]), "t-red");
      if (res.node.type === "dir")
        return push("cat: " + esc(args[0]) + ": is a directory", "t-red");
      pushText(res.node.content);
    },
    pwd: () =>
      push(
        "/home/" +
          user +
          (cwd.current.length ? "/" + cwd.current.join("/") : ""),
      ),
    tree: () => {
      push('<span class="t-blue">~</span>');
      const walk = (node: FsDir, prefix: string) => {
        const keys = Object.keys(node.children).filter(
          (k) => !node.children[k].hidden,
        );
        keys.forEach((k, i) => {
          const last = i === keys.length - 1;
          const ch = node.children[k];
          const branch = last ? "\u2514\u2500\u2500 " : "\u251C\u2500\u2500 ";
          const isDir = ch.type === "dir";
          push(
            '<span class="t-dim">' +
              prefix +
              branch +
              "</span>" +
              (isDir
                ? '<span class="t-blue">' + k + "/</span>"
                : '<span class="t-cyan">' + k + "</span>"),
          );
          if (isDir)
            walk(
              ch as FsDir,
              prefix +
                (last
                  ? "\u00A0\u00A0\u00A0\u00A0"
                  : "\u2502\u00A0\u00A0\u00A0"),
            );
        });
      };
      walk(FS, "");
    },
    open: (args) => {
      const slug = args[0];
      if (!slug) return push("open: which project? try 'ls projects'", "t-red");
      const p = PROJECTS.find((x) => x.slug === slug.replace(/\/$/, ""));
      if (!p) return push("open: unknown project: " + esc(slug), "t-red");
      const url = p.live || p.repo;
      push(
        'opening <span class="t-cyan">' + esc(url) + "</span> ...",
        "t-green",
      );
      try {
        window.open(url, "_blank", "noopener");
      } catch {}
    },
    whoami: () => {
      push(
        '<span class="t-green">' +
          esc(BIO.name) +
          '</span> <span class="t-dim">(' +
          esc(L(BIO.role, lang)) +
          ")</span>",
      );
      push(esc(L(BIO.tagline, lang)));
    },
    echo: (args) => push(esc(args.join(" "))),
    clear: () => {
      buf = ["__CLEAR__"];
    },
    sudo: (args) => {
      if (args.join(" ") === "hire-me") {
        push(
          '<span class="t-yellow">[sudo] password for guest:</span> <span class="t-dim">************</span>',
        );
        push('<span class="t-green">access granted. good choice.</span>');
        push(
          lang === "id"
            ? "membuka checkpoint kontak ..."
            : "opening the contact checkpoint ...",
          "t-dim",
        );
        onHire?.();
        return;
      }
      push("sudo: command not found: " + esc(args.join(" ")), "t-red");
    },
  };

  const run = (raw: string) => {
    buf = [];
    const line = raw.trim();
    push(promptHTML() + '<span class="cmd">' + esc(line) + "</span>");
    if (line) {
      history.current.push(line);
      hIdx.current = history.current.length;
      const parts = line.split(/\s+/);
      const cmd = parts[0];
      const args = parts.slice(1);
      if (COMMANDS[cmd]) COMMANDS[cmd](args);
      else
        push(
          "command not found: " + esc(cmd) + '. type "help" for the list.',
          "t-red",
        );
    }
    if (buf[0] === "__CLEAR__") {
      setLines([]);
    } else {
      const add = buf;
      setLines((prev) => prev.concat(add));
    }
  };

  const welcome = () => {
    buf = [];
    push(
      '<span class="t-dim">Last login: session started on ashofah.me</span>',
    );
    push('<span class="t-green">\u256D\u2500 welcome to my machine.</span>');
    push(
      '<span class="t-dim">\u2570\u2500 type</span> <span class="t-green">help</span> <span class="t-dim">to list commands, or</span> <span class="t-green">tree</span> <span class="t-dim">to see everything.</span>',
    );
    push("");
    COMMANDS.whoami([]);
    push("");
    setLines(buf.slice());
  };

  // reset + welcome whenever language changes
  useEffect(() => {
    cwd.current = [];
    welcome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    if (bodyRef.current)
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (hIdx.current > 0) {
        hIdx.current--;
        setValue(history.current[hIdx.current] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hIdx.current < history.current.length) {
        hIdx.current++;
        setValue(history.current[hIdx.current] || "");
      }
    } else if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      autocomplete();
    }
  };

  const autocomplete = () => {
    const parts = value.split(/\s+/);
    const frag = parts[parts.length - 1] || "";
    const dir = nodeAt(cwd.current);
    if (!dir || dir.type !== "dir") return;
    const matches = Object.keys(dir.children).filter(
      (k) => !dir.children[k].hidden && k.indexOf(frag) === 0,
    );
    if (matches.length === 1) {
      parts[parts.length - 1] = matches[0];
      setValue(parts.join(" "));
    }
  };

  const chips = [
    "help",
    "ls",
    "cd projects",
    "tree",
    "cat about.txt",
    "sudo hire-me",
  ];

  return (
    <div
      className="term"
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest("a,button"))
          inputRef.current?.focus();
      }}
    >
      <div className="term-bar">
        <div className="term-btns">
          <i className="r" />
          <i className="y" />
          <i className="g" />
        </div>
        <span className="term-title">
          <Icon slug="terminal" /> <b>{user}@ashofah</b>: ~
        </span>
      </div>
      <div className="term-body" ref={bodyRef}>
        {lines.map((html, i) => (
          <div key={i} dangerouslySetInnerHTML={mk(html)} />
        ))}
      </div>
      <div className="term-input-row">
        <span className="ps" dangerouslySetInnerHTML={mk(promptHTML())} />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label={t("terminal.input")}
        />
      </div>
      <div className="term-chips">
        {chips.map((c) => (
          <button
            key={c}
            onClick={() => {
              run(c);
              inputRef.current?.focus();
            }}
          >
            <span className="k">$</span> {c}
          </button>
        ))}
      </div>
    </div>
  );
}
