import React, { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  Copy,
  Download,
  Menu,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import Skeleton, { skeletonFor } from "./ui/Skeleton.jsx";
import { entries } from "./examples/list.js";
import { describe } from "./examples/notes.js";
import { download, standalone } from "./export-example.js";
import { useAppearance } from "./ui/Appearance.jsx";
import "./library.css";
const raw = import.meta.glob(
  [
    "./ui/*.{jsx,css}",
    "./examples/*.jsx",
    "./charts/*.{jsx,js,css}",
    "./*.css",
    "./model.js",
    "./motion.js",
    "./Portal.jsx",
    "./examples/examples.css",
  ],
  { eager: true, query: "?raw", import: "default" },
);
function sources(entry) {
  const files = new Set();
  function visit(path) {
    if (files.has(path) || !raw[path]) return;
    files.add(path);
    for (const [, rel] of raw[path].matchAll(
      /(?:from\s+|import\s*\(\s*|import\s*)['"](\.[^'"]+)['"]/g,
    )) {
      const u = new URL(rel, new URL(path, "https://local.invalid/src/"));
      visit("." + u.pathname.slice(4));
    }
  }
  visit("./examples/" + entry.id + ".jsx");
  visit("./tokens.css");
  return [...files];
}
export default function Library({ id }) {
  const entry =
    entries.find((e) => e.id === id) ||
    entries.find((e) => e.id === "ScreenOverview");
  const component = entry.component || entry.id;
  const [q, setQ] = useState(""),
    [category, setCategory] = useState("Все"),
    [drawer, setDrawer] = useState(false),
    [mode, setMode] = useState("wide"),
    [run, replay] = useState(0),
    [selected, select] = useState(""),
    [msg, setMsg] = useState(""),
    [height, setHeight] = useState(300);
  const frame = useRef(null),
    timeout = useRef(null);
  const { theme, accent } = useAppearance();
  const request = [entry.id, run, theme, accent].join("/");
  const [ready, setReady] = useState("");
  const [frameError, setFrameError] = useState("");
  const [description, motion] = describe(entry);
  const files = sources(entry);
  const path = files.includes(selected) ? selected : files[0];
  const categories = [
      ...new Set(["Рабочие экраны", ...entries.map((e) => e.category)]),
    ],
    visible = entries.filter(
      (e) =>
        (category === "Все" || e.category === category) &&
        (e.title + " " + e.id + " " + e.category)
          .toLowerCase()
          .includes(q.trim().toLowerCase()),
    );
  useEffect(() => {
    setDrawer(false);
    select("");
    setMsg("");
    setHeight(300);
    document.title = entry.title + " · Справочник · Кваркус Кит";
  }, [entry]);
  useEffect(() => {
    function receive(e) {
      if (
        e.origin === location.origin &&
        e.source === frame.current?.contentWindow &&
        e.data?.kind === "kvarkus-preview-error"
      )
        setFrameError(e.data.request);
      if (
        e.origin === location.origin &&
        e.source === frame.current?.contentWindow &&
        e.data?.kind === "kvarkus-preview-size" &&
        Number.isFinite(e.data.height)
      ) {
        setHeight(Math.min(760, Math.max(240, e.data.height)));
        setReady(e.data.request);
      }
    }
    window.addEventListener("message", receive);
    return () => {
      window.removeEventListener("message", receive);
      clearTimeout(timeout.current);
    };
  }, []);
  async function action(kind) {
    try {
      if (kind === "html") {
        download(
          await standalone(entry),
          "text/html;charset=utf-8",
          entry.id + ".html",
        );
        setMsg("Пример скачан");
      } else {
        await navigator.clipboard.writeText(
          kind === "file" ? raw[path] : await standalone(entry),
        );
        setMsg(
          kind === "file" ? "Код файла скопирован" : "Полный пример скопирован",
        );
      }
    } catch {
      setMsg("Действие не удалось. Код можно выделить вручную.");
    }
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setMsg(""), 3500);
  }
  const mapped = entries.indexOf(entry) < 33;
  return (
    <div className="library">
      <div className="library-layout">
        <button
          className="browse"
          aria-expanded={drawer}
          onClick={() => setDrawer(!drawer)}
        >
          {drawer ? <X /> : <Menu />} Разделы справочника
        </button>
        <aside className={"lib-side" + (drawer ? " opened" : "")}>
          <h2>
            Справочник <span>{entries.length}</span>
          </h2>
          <label className="lib-search">
            <Search />
            <input
              type="search"
              aria-label="Поиск примера"
              placeholder="Компонент или эффект"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
          <select
            aria-label="Раздел"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {["Все", ...categories].map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
          <nav aria-label="Примеры">
            {categories.map((g) => {
              const list = visible.filter((e) => e.category === g);
              return (
                list.length > 0 && (
                  <section key={g}>
                    <h3>{g}</h3>
                    {list.map((e) => (
                      <a
                        key={e.id}
                        aria-current={e.id === entry.id ? "page" : undefined}
                        href={"#kit/" + e.id}
                      >
                        {e.title}
                      </a>
                    ))}
                  </section>
                )
              );
            })}
            {!visible.length && <p>Совпадений нет</p>}
          </nav>
        </aside>
        <main className="lib-main">
          <div className="lib-kicker">{entry.category}</div>
          <div className="lib-title">
            <h1>{entry.title}</h1>
          </div>
          <p className="lib-description">{description}</p>
          <div className="preview-tools">
            <div role="group" aria-label="Ширина примера">
              {[
                ["wide", "По ширине"],
                ["phone", "Телефон"],
              ].map(([key, name]) => (
                <button
                  type="button"
                  key={key}
                  aria-pressed={mode === key}
                  onClick={() => setMode(key)}
                >
                  {name}
                </button>
              ))}
            </div>
            <button onClick={() => replay((n) => n + 1)}>
              <RotateCcw /> Повторить
            </button>
          </div>
          <div
            className="preview-canvas"
            aria-busy={ready !== request && frameError !== request}
          >
            {frameError === request && (
              <div className="load-error" role="alert">
                Не удалось загрузить пример.{" "}
                <button onClick={() => replay((n) => n + 1)}>
                  Повторить загрузку
                </button>
              </div>
            )}
            {ready !== request && frameError !== request && (
              <div className="preview-loading">
                <Skeleton kind={skeletonFor(entry.id)} />
              </div>
            )}
            <iframe
              key={request}
              ref={frame}
              hidden={frameError === request}
              onLoad={(e) => {
                const doc = e.currentTarget.contentDocument;
                if (!doc?.getElementById("root")) setFrameError(request);
              }}
              onError={() => setFrameError(request)}
              className={mode === "phone" ? "phone" : ""}
              title={"Живой пример · " + entry.title}
              style={{ height: component === "ScreenDemo" ? 700 : height }}
              src={
                "./sample.html?" +
                new URLSearchParams({ id: entry.id, theme, accent, request })
              }
            />
          </div>
          <div className="guide-actions">
            <button onClick={() => action("html")}>
              <Download /> Скачать HTML
            </button>
            <button onClick={() => action("all")}>
              <Copy /> Копировать пример
            </button>
            <a download href={"./downloads/" + entry.id + ".zip"}>
              ZIP с React-кодом
            </a>
            <a href="./downloads/kvarkus-kit.zip" download>
              Весь кит
            </a>
            <a href="./downloads/elements.csv" download>
              Карта CSV
            </a>
          </div>
          <p className="guide-motion">
            <b>Движение</b> {motion}
          </p>
          <section className="source-block">
            <header>
              <h2>
                <BookOpen /> Код примера
              </h2>
              <button onClick={() => action("file")}>
                <Copy /> Копировать файл
              </button>
            </header>
            <div className="file-selector">
              <div className="code-types" role="group" aria-label="Исходники">
                {[
                  ["Пример", files[0]],
                  [
                    "React",
                    entry.kind
                      ? "./charts/ChartPanel.jsx"
                      : "./ui/" + component + ".jsx",
                  ],
                  [
                    "CSS",
                    entry.kind
                      ? "./charts/charts.css"
                      : "./ui/" + component + ".css",
                  ],
                  [
                    "Движение",
                    entry.kind
                      ? "./charts/ChartCanvas.jsx"
                      : component === "Skeleton"
                        ? "./ui/Skeleton.css"
                        : files.includes("./motion.js")
                          ? "./motion.js"
                          : "./motion.css",
                  ],
                ].map(([label, p]) => (
                  <button
                    key={label}
                    aria-pressed={path === p}
                    onClick={() => select(p)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <label>
                Файл{" "}
                <select value={path} onChange={(e) => select(e.target.value)}>
                  {files.map((f) => (
                    <option key={f} value={f}>
                      {f.slice(2)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <pre tabIndex={0}>
              <code>{raw[path]}</code>
            </pre>
          </section>
          <p className="guide-msg" role="status">
            {msg}
          </p>
          <footer className="lib-foot">
            {mapped && (
              <a href={"#map/component/" + entry.id}>
                Положение на карте версии 1.1 <ArrowUpRight />
              </a>
            )}
            <span>React · CSS · JavaScript</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
