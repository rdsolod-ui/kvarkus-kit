import React from "react";
import { useState } from "react";
import ListSearch from "./ListSearch.jsx";
import TaskRow from "./TaskRow.jsx";
import SummaryStrip from "./SummaryStrip.jsx";
import "./Registry.css";
import "./Agenda.css";

export default function Agenda({ tasks, onToggle, onOpen }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const sections = ["Просрочено", "На этой неделе", "Позже", "Завершено"];
  const inSection = (t, s) =>
    t.done
      ? s === "Завершено"
      : (t.bucket === "Завершено" ? "На этой неделе" : t.bucket) === s;
  const counts = sections.map((label) => ({
    label,
    value: tasks.filter((t) => inSection(t, label)).length,
  }));
  return (
    <div className="agenda">
      <SummaryStrip
        selected={active}
        onSelect={setActive}
        items={[
          {
            label: "Все задачи",
            value:
              tasks.filter((t) => t.done).length +
              " из " +
              tasks.length,
            detail: "выполнено",
            progress:
              (100 * tasks.filter((t) => t.done).length) /
              Math.max(1, tasks.length),
          },
          { label: "Просрочено", value: counts[0].value },
          {
            label: "Сегодня",
            value: tasks.filter((t) => !t.done && t.date === "2026-11-24")
              .length,
          },
          counts[1],
          counts[3],
        ]}
      />
      <div className="agenda-list">
        <div className="task-tools">
          <ListSearch label="Найти задачу" value={query} onChange={setQuery} />
        </div>
        <div className="task-scroll">
          {sections
            .filter(
              (s) =>
                active === 0 ||
                s ===
                  [
                    null,
                    "Просрочено",
                    "Сегодня",
                    "На этой неделе",
                    "Завершено",
                  ][active] ||
                (active === 2 &&
                  tasks.some(
                    (t) =>
                      !t.done && t.date === "2026-11-24" && inSection(t, s),
                  )),
            )
            .map((s) => (
              <section className="task-group" key={s}>
                <h2>
                  {s} <small>{counts.find((c) => c.label === s)?.value}</small>
                </h2>
                {tasks
                  .filter(
                    (t) =>
                      inSection(t, s) &&
                      (active !== 2 || t.date === "2026-11-24") &&
                      t.name.toLowerCase().includes(query.toLowerCase()),
                  )
                  .map((t) => (
                    <TaskRow
                      key={t.id}
                      task={t}
                      onToggle={() => onToggle(t.id)}
                      onOpen={() => onOpen(t)}
                    />
                  ))}
                {!tasks.some(
                  (t) =>
                    inSection(t, s) &&
                    t.name.toLowerCase().includes(query.toLowerCase()),
                ) && <small>Задач нет</small>}
              </section>
            ))}
          {active === 2 &&
            !tasks.some((t) => !t.done && t.date === "2026-11-24") && (
              <p>На сегодня задач нет.</p>
            )}
        </div>
      </div>
    </div>
  );
}
