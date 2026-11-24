import React from "react";
import { useState } from "react";
import { Search, ArrowUpRight } from "lucide-react";
import { screens } from "../model.js";
import "./CommandSearch.css";

export default function CommandSearch({ model, onSelect }) {
  const [query, setQuery] = useState("");
  const q = query.toLocaleLowerCase("ru-RU").trim();
  const entries = [
    ...screens.map(([page, title]) => ({ page, title, kind: "Раздел" })),
    ...["customers", "deals", "billing"].flatMap((page) =>
      model[page].map((record) => ({
        page,
        title: record.name,
        kind: screens.find((s) => s[0] === page)[1],
        record,
      })),
    ),
  ];
  const found = entries
    .filter((x) =>
      [x.title, x.kind, x.record?.buyer, x.record?.vehicle]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("ru-RU")
        .includes(q),
    )
    .slice(0, 12);
  return (
    <div className="command">
      <label>
        <Search />
        <input
          autoFocus
          aria-label="Поиск"
          placeholder="Найти раздел или запись…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && found[0]) {
              e.preventDefault();
              onSelect(found[0]);
            }
          }}
        />
      </label>
      <div>
        {found.map((x) => (
          <button
            key={x.page + (x.record?.id || "")}
            onClick={() => onSelect(x)}
          >
            <span>
              {x.title}
              <small>{x.kind}</small>
            </span>
            <ArrowUpRight />
          </button>
        ))}
        {!found.length && <p>Ничего не найдено</p>}
      </div>
    </div>
  );
}
