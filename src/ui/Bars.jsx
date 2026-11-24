import React from "react";
import { useState } from "react";
import { TrendingUp } from "lucide-react";
import Badge from "./Badge.jsx";
import "./Bars.css";

export default function Bars({
  values,
  labels,
  amounts,
  title = "Стоимость выданных автомобилей",
}) {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const peak = values.indexOf(Math.max(...values));
  const max = Math.max(1, ...values);
  return (
    <section className="bars-box tile">
      <header>
        <h2>{title}</h2>
        <Badge>
          <TrendingUp />
          {"Пик " + (labels[peak] || "—")}
        </Badge>
      </header>
      <div className="bars">
        {values.map((v, i) => (
          <button
            key={labels[i]}
            className={
              "bar-column" +
              (selected === i || (selected === null && i === values.length - 1)
                ? " lit"
                : "")
            }
            aria-label={labels[i] + ", " + (amounts?.[i] ?? v + " авто")}
            aria-pressed={selected === i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(i)}
            onBlur={() => {
              setHovered(null);
              setSelected(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setHovered(null);
                setSelected(null);
              }
            }}
            onClick={() => setSelected(selected === i ? null : i)}
          >
            <i className="bar-track">
              <i style={{ height: (Math.max(0, v) / max) * 100 + "%" }}>
                {(hovered === i || selected === i) && (
                  <b className="bar-tip">
                    {labels[i]}
                    <strong>{amounts ? amounts[i] : v + " авто"}</strong>
                  </b>
                )}
              </i>
            </i>
            <span>{labels[i]}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
