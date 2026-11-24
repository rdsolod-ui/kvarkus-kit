import React from "react";
import { ArrowUpRight } from "lucide-react";
import ChartPanel from "./ChartPanel.jsx";
import { chartGroups, charts } from "./catalog.js";
export default function Analytics({ id }) {
  const entry = charts.find((c) => c.id === id) || charts[0];
  return (
    <main className="analytics">
      <header>
        <div>
          <h1>Аналитика продаж</h1>
        </div>
        <a href={"#kit/" + entry.id}>
          Открыть код <ArrowUpRight size={15} />
        </a>
      </header>
      <div className="analytics-layout">
        <nav aria-label="Виды графиков">
          <label className="chart-picker">
            Вид графика
            <select
              value={entry.id}
              onChange={(e) => (location.hash = "charts/" + e.target.value)}
            >
              {Object.entries(chartGroups).map(([group, items]) => (
                <optgroup key={group} label={group}>
                  {items.map(([kind, title]) => (
                    <option key={kind} value={"Chart" + kind}>
                      {title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <div className="chart-index">
            {Object.keys(chartGroups).map((group) => (
              <section key={group}>
                <h2>{group}</h2>
                {charts
                  .filter((c) => c.group === group)
                  .map((c) => (
                    <a
                      href={"#charts/" + c.id}
                      aria-current={c === entry ? "page" : undefined}
                      key={c.id}
                    >
                      {c.title}
                    </a>
                  ))}
              </section>
            ))}
          </div>
        </nav>
        <ChartPanel kind={entry.kind} />
      </div>
    </main>
  );
}
