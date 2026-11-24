import React, { useState } from "react";
import ListSearch from "./ListSearch.jsx";
import RecordRow from "./RecordRow.jsx";
import SummaryStrip from "./SummaryStrip.jsx";
import Tabs from "./Tabs.jsx";
import { groups, money, statuses } from "../model.js";
import "./Registry.css";

export default function Registry({
  rows,
  customer = false,
  filter,
  onFilter,
  onOpen,
  kind = customer ? "customers" : "deals",
}) {
  const [query, setQuery] = useState("");
  const states = statuses[kind];
  const [metric, setMetric] = useState(0);
  const sum = (list) => list.reduce((a, r) => a + r.value, 0);
  const visible = rows.filter(
    (r) =>
      (!metric || r.status === states[metric - 1]) &&
      (filter === "Все" || r.group === filter || r.status === filter) &&
      [r.name, r.vehicle, r.buyer, r.detail]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()),
  );
  return (
    <div className="registry">
      <SummaryStrip
        selected={metric}
        onSelect={setMetric}
        items={[
          {
            label: customer
              ? "Бюджеты клиентов"
              : kind === "deals"
                ? "Сумма сделок"
                : "Сумма счетов",
            value: money(sum(rows)),
            detail: "Записей: " + rows.length,
          },
          ...states.map((label) => {
            const subset = rows.filter((r) => r.status === label);
            return { label, value: subset.length, detail: money(sum(subset)) };
          }),
        ]}
      />
      <div className="records">
        <div className="list-tools">
          <ListSearch
            label={
              {
                customers: "Найти клиента",
                deals: "Найти сделку",
                billing: "Найти счёт",
              }[kind]
            }
            value={query}
            onChange={setQuery}
          />
          {customer && (
            <Tabs
              counts={Object.fromEntries(
                ["Все", ...groups].map((g) => [
                  g,
                  rows.filter((r) => g === "Все" || r.group === g).length,
                ]),
              )}
              items={["Все", ...(customer ? groups : states)]}
              value={filter}
              onChange={onFilter}
            />
          )}
        </div>
        <div className="record-scroll">
          {visible.map((r) => (
            <RecordRow
              key={r.id}
              record={r}
              customer={customer}
              onClick={() => onOpen(r)}
            />
          ))}
          {!visible.length && <p>По этим условиям записей нет.</p>}
        </div>
      </div>
    </div>
  );
}
