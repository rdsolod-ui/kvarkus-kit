import React from "react";
import { useId } from "react";
import { percent } from "../model.js";
import "./Ring.css";

export default function Ring({ value, total, label = "Выдано" }) {
  const id = useId();
  const pct = percent(value, total);
  return (
    <section className="ring-box tile">
      <h2>{label}</h2>
      <div
        className="ring"
        role="img"
        aria-label={pct + "%, " + value + " из " + total}
      >
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <defs>
            <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop stopColor="var(--coral)" />
              <stop offset="1" stopColor="var(--red)" />
            </linearGradient>
          </defs>
          <circle
            cx="60"
            cy="60"
            r="48"
            fill="none"
            stroke="#ffffff20"
            strokeWidth="12"
          />
          <circle
            className="ring-value"
            cx="60"
            cy="60"
            r="48"
            fill="none"
            stroke={"url(#" + id + ")"}
            strokeWidth="12"
            pathLength="100"
            strokeDasharray={pct + " 100"}
            transform="rotate(-90 60 60)"
            strokeLinecap="round"
          />
        </svg>
        <div>
          <b>{pct}%</b>
          <small>
            {value} из {total} сделок
          </small>
        </div>
      </div>
    </section>
  );
}
