import React, { lazy, useMemo, useState, useSyncExternalStore } from "react";
import { RotateCcw } from "lucide-react";
import { charts } from "./catalog.js";
import { trends } from "./trends.js";
import { compare } from "./compare.js";
import { parts } from "./parts.js";
import { distributions } from "./distributions.js";
import { flows } from "./flows.js";
import { LoadingBoundary } from "../ui/Skeleton.jsx";
import { useAppearance } from "../ui/Appearance.jsx";
import "./charts.css";
const ChartCanvas = lazy(() => import("./ChartCanvas.jsx"));
const builders = {
  Динамика: trends,
  Сравнение: compare,
  "Состав и цели": parts,
  Распределения: distributions,
  "Связи и процессы": flows,
};
const pref = () => matchMedia("(prefers-reduced-motion: reduce)");
function subscribe(fn) {
  const media = pref();
  media.addEventListener("change", fn);
  return () => media.removeEventListener("change", fn);
}
export default function ChartPanel({ kind = "Line" }) {
  const chart = charts.find((c) => c.kind === kind) || charts[0];
  const [oct, setOct] = useState(false),
    [play, replay] = useState(0);
  const reduced = useSyncExternalStore(subscribe, () => pref().matches);
  const { theme, accent } = useAppearance();
  const { headers, rows, option } = useMemo(
    () => builders[chart.group](chart.kind, oct),
    [chart, oct],
  );
  return (
    <section className="chart-panel" aria-label={chart.title}>
      <header className="chart-head">
        <div>
          <p>{chart.title}</p>
          <h2>{chart.subject}</h2>
        </div>
        <div className="chart-actions">
          <div
            className="chart-periods"
            role="group"
            aria-label="Демонстрационный период"
          >
            {["Октябрь", "Ноябрь"].map((name, i) => (
              <button
                key={name}
                aria-pressed={oct === (i === 0)}
                onClick={() => setOct(i === 0)}
              >
                {name}
              </button>
            ))}
          </div>
          <button
            className="chart-replay"
            onClick={() => replay((n) => n + 1)}
            aria-label="Повторить анимацию"
            title="Повторить анимацию"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </header>
      <LoadingBoundary kind="chart">
        <ChartCanvas
          option={option}
          kind={chart.kind}
          title={chart.subject}
          reduced={reduced}
          theme={theme}
          accent={accent}
          replay={play}
        />
      </LoadingBoundary>
      <div className="chart-foot">
        <span>Демонстрационные данные · {oct ? "октябрь" : "ноябрь"} 2026</span>
      </div>
      <details className="chart-table">
        <summary>Таблица данных</summary>
        <div tabIndex="0" aria-label="Значения диаграммы">
          <table>
            <caption>{chart.subject}</caption>
            <thead>
              <tr>
                {headers.map((h) => (
                  <th scope="col" key={h}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {row.map((v, j) => (
                    <td key={j}>
                      {typeof v === "number" ? v.toLocaleString("ru-RU") : v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
