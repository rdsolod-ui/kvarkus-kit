import React, { useSyncExternalStore } from "react";
import { Sun, Moon, Check } from "lucide-react";
import "./Appearance.css";
export const accents = {
  coral: "Коралл",
  teal: "Бирюза",
  blue: "Лазурь",
  violet: "Фиалка",
};
const key = "kvarkus.appearance.v2",
  signal = "kvarkus-appearance";
function read() {
  try {
    return localStorage.getItem(key) || "";
  } catch {
    return "";
  }
}
let cached = read(),
  isolated = false;
export function setPreviewAppearance(values) {
  isolated = true;
  cached = JSON.stringify({ ...currentAppearance(), ...values });
  applyAppearance();
}
function parse(value) {
  try {
    return JSON.parse(value) || {};
  } catch {
    return {};
  }
}
export function currentAppearance() {
  const saved = parse(cached);
  return {
    theme: saved.theme === "light" ? "light" : "dark",
    accent: Object.hasOwn(accents, saved.accent) ? saved.accent : "coral",
  };
}
export function applyAppearance() {
  const { theme, accent } = currentAppearance();
  Object.assign(document.documentElement.dataset, { theme, accent });
}
function update(values) {
  cached = JSON.stringify({ ...currentAppearance(), ...values });
  try {
    if (!isolated) localStorage.setItem(key, cached);
  } catch {}
  applyAppearance();
  window.dispatchEvent(new Event(signal));
}
function subscribe(listener) {
  function sync(e) {
    if (!isolated && (e.key === key || e.key === null)) {
      cached = read();
      applyAppearance();
      listener();
    }
  }
  window.addEventListener("storage", sync);
  window.addEventListener(signal, listener);
  return () => {
    window.removeEventListener("storage", sync);
    window.removeEventListener(signal, listener);
  };
}
export function useAppearance() {
  useSyncExternalStore(subscribe, () => cached);
  return currentAppearance();
}
export default function Appearance() {
  const { theme, accent } = useAppearance();
  return (
    <div className="appearance">
      <div role="group" aria-label="Акцентный цвет" className="swatches">
        {Object.entries(accents).map(([id, name]) => (
          <button
            key={id}
            type="button"
            data-swatch={id}
            aria-label={name}
            title={name}
            aria-pressed={accent === id}
            onClick={() => update({ accent: id })}
          >
            {accent === id && <Check aria-hidden="true" />}
          </button>
        ))}
      </div>
      <button
        className="theme-switch"
        type="button"
        role="switch"
        aria-label="Светлая тема"
        aria-checked={theme === "light"}
        title={
          theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"
        }
        onClick={() => update({ theme: theme === "dark" ? "light" : "dark" })}
      >
        {theme === "dark" ? <Moon /> : <Sun />}
        <span>{theme === "dark" ? "Тёмная" : "Светлая"}</span>
      </button>
    </div>
  );
}
