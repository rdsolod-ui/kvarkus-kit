import React from "react";
import Appearance from "./Appearance.jsx";
import "./Foundation.css";
export default function Foundation({ kind = "type" }) {
  if (kind === "color")
    return (
      <div className="foundation">
        <Appearance />
        <div className="tone-chips">
          {["Акцент", "Текст", "Стекло", "Граница"].map((name, i) => (
            <span
              key={name}
              style={{
                "--tone": [
                  "var(--red)",
                  "var(--ink)",
                  "var(--pane)",
                  "var(--line)",
                ][i],
              }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    );
  if (kind === "type")
    return (
      <div className="foundation type-scale">
        <h2>Запись на тест-драйв</h2>
        <p>Подготовить к поездке Haval Jolion Elite.</p>
        <small>Вторник, 24 ноября · 09:30</small>
        <strong>2 450 000 ₽</strong>
      </div>
    );
  const sizes = kind === "radius" ? [8, 12, 18, 26] : [4, 8, 12, 16, 24, 32];
  return (
    <div className="token-sizes">
      {sizes.map((n) => (
        <div key={n}>
          <i
            style={
              kind === "radius"
                ? { borderRadius: n }
                : { width: n * 2, height: 12 }
            }
          />
          <code>{n} px</code>
        </div>
      ))}
    </div>
  );
}
