import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Download, Layers } from "lucide-react";
import data from "./reference-map.json";
import { entries } from "./examples/list.js";
import { screens } from "./model.js";
import "./reference-map.css";
const reference =
  "https://nuviocyber.com/demo/physio-clinic-portal/f/index.html";
const dimensions = ["X", "Y", "Ширина", "Высота"];
const href = (s, r) => "#map/" + s.id + (r ? "/" + r.id : "");
const round = (n) => Math.round(n * 10) / 10;
const matches = (a, b) => a?.map((v, i) => round(b[i] - v));
const title = (s) => s.title + " · " + s.width + " × " + s.height;
function exportMap() {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "physio-reference-map-" + data.version + ".json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function Rect({ box, ...props }) {
  if (!box) return null;
  const [x, y, width, height] = box;
  return (
    <rect
      {...{ x, y, width, height, ...props }}
      vectorEffect="non-scaling-stroke"
    />
  );
}
function Footprint({ state, row, showRef, showKit }) {
  const height = Math.max(
    state.height,
    ...state.rows
      .flatMap((x) => [x.ref, x.kit].filter(Boolean).map((b) => b[1] + b[3]))
      .filter((y) => y < state.height * 4),
  );
  return (
    <svg
      className="map-drawing"
      viewBox={`0 0 ${state.width} ${height}`}
      role="img"
      aria-label={"Схема экрана. Выбранный элемент — " + row.label}
    >
      <rect width={state.width} height={height} fill="#192632" />
      {state.rows.map((r) => (
        <React.Fragment key={r.id}>
          {showRef && <Rect box={r.ref} className="wire source" />}
          {showKit && <Rect box={r.kit} className="wire build" />}
        </React.Fragment>
      ))}
      {showRef && <Rect box={row.ref} className="chosen source" />}
      {showKit && <Rect box={row.kit} className="chosen build" />}
    </svg>
  );
}
export default function ReferenceMap({ route }) {
  const [, stateKey, rowKey] = route.split("/");
  const component = stateKey === "component" ? rowKey : null;
  const candidates = component
    ? data.states.filter((s) => s.rows.some((r) => r.component === component))
    : data.states;
  const [componentState, setComponentState] = useState(null);
  const state =
    candidates.find((s) => s.id === (component ? componentState : stateKey)) ||
    candidates[0] ||
    data.states[0];
  const rows =
    component && candidates.length
      ? state.rows.filter((r) => r.component === component)
      : state.rows;
  const selected = rows.find((r) => !component && r.id === rowKey) || rows[0];
  const [showRef, setShowRef] = useState(true),
    [showKit, setShowKit] = useState(true);
  useEffect(() => {
    document.title = state.title + " · Карта референса";
  }, [state]);
  const delta =
    selected.ref && selected.kit ? matches(selected.ref, selected.kit) : null;
  return (
    <main className="ref-map">
      <div className="map-wrap">
        <header className="map-head">
          <a href="#kit">
            <ArrowLeft /> Библиотека
          </a>
          <button type="button" onClick={exportMap}>
            <Download /> Скачать JSON
          </button>
        </header>
        <h1>Карта экранов автосалона</h1>
        <nav className="map-index" aria-label="Экраны автосалона">
          {entries
            .filter((entry) => entry.component === "ScreenDemo")
            .map((entry, i) => (
              <div className="screen-map-row" key={entry.id}>
                <a href={"#screen/" + screens[i][0]}>{screens[i][1]}</a>
                <a href={"#kit/" + entry.id}>
                  Пример и код <ArrowUpRight size={15} />
                </a>
              </div>
            ))}
        </nav>
        <h2>Архив геометрии прототипа</h2>
        <p className="map-description">
          Архив замеров прототипа 1.1.0 и демо Nuvio № 140 до смены тематики и
          оформления. Координаты отсчитаны от левого верхнего угла окна в
          CSS-пикселях.
        </p>
        <div className="map-controls">
          <label>
            Экран и состояние
            <select
              value={state.id}
              onChange={(e) => {
                if (component) setComponentState(e.target.value);
                else location.hash = "map/" + e.target.value;
              }}
            >
              {(candidates.length ? candidates : data.states).map((s) => (
                <option key={s.id} value={s.id}>
                  {title(s)}
                </option>
              ))}
            </select>
          </label>
          <label>
            Элемент{component ? " · " + component : ""}
            <select
              value={selected.id}
              onChange={(e) => {
                location.hash = href(
                  state,
                  rows.find((r) => r.id === e.target.value),
                );
              }}
            >
              {rows.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label} · {r.component}
                </option>
              ))}
            </select>
          </label>
          {component && <a href={href(state, selected)}>Все элементы экрана</a>}
        </div>
        <p className="map-trigger">{state.trigger}</p>
        <div className="map-grid">
          <section className="map-canvas">
            <div className="map-legend">
              <label>
                <input
                  type="checkbox"
                  checked={showRef}
                  onChange={(e) => setShowRef(e.target.checked)}
                />
                Референс
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={showKit}
                  onChange={(e) => setShowKit(e.target.checked)}
                />
                React-кит
              </label>
            </div>
            <Footprint
              state={state}
              row={selected}
              showRef={showRef}
              showKit={showKit}
            />
          </section>
          <section className="map-inspect" aria-live="polite">
            <p className="map-id">{selected.component}</p>
            <h2>{selected.label}</h2>
            <table>
              <caption>Геометрия в CSS-пикселях</caption>
              <thead>
                <tr>
                  <th>Размер</th>
                  <th>Демо</th>
                  <th>Кит</th>
                  <th>Δ</th>
                </tr>
              </thead>
              <tbody>
                {dimensions.map((axis, i) => (
                  <tr key={axis}>
                    <th scope="row">{axis}</th>
                    <td>{selected.ref?.[i] ?? "—"}</td>
                    <td>{selected.kit?.[i] ?? "—"}</td>
                    <td>
                      {delta ? (delta[i] > 0 ? "+" : "") + delta[i] : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {selected.note && <p>{selected.note}</p>}
            {!delta && (
              <p>
                {selected.ref
                  ? "В этом состоянии элемент измерен только в демо."
                  : "В этом состоянии элемент измерен только в React-ките."}
              </p>
            )}
            <a className="map-code" href={"#kit/" + selected.component}>
              <Layers /> Открыть код компонента
            </a>
            <a href={"#screen/" + state.screen}>
              Экран в ките <ArrowUpRight />
            </a>
            <a href={reference} target="_blank" rel="noreferrer">
              Исходное демо <ArrowUpRight />
            </a>
          </section>
        </div>
        <nav className="map-index" aria-label="Элементы состояния">
          <h2>
            Элементы состояния <span>{rows.length}</span>
          </h2>
          {rows.map((r) => (
            <a
              key={r.id}
              href={href(state, r)}
              aria-current={r.id === selected.id ? "true" : undefined}
            >
              <span>{r.label}</span>
              <code>{r.component}</code>
            </a>
          ))}
        </nav>
      </div>
    </main>
  );
}
