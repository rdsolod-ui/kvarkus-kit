import React from "react";
import { Search } from "lucide-react";
import "./SearchTrigger.css";
export default function SearchTrigger({ value, onChange, onClick, onEnter }) {
  if (!onChange)
    return (
      <button
        className="search-trigger"
        aria-label="Поиск по меню"
        onClick={onClick}
      >
        <Search />
        <span>Поиск по меню…</span>
        <kbd>Ctrl K</kbd>
      </button>
    );
  return (
    <div className="search-trigger">
      <Search />
      <input
        aria-label="Поиск по меню"
        placeholder="Поиск по меню…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && value.trim()) onEnter?.();
          if (e.key === "Escape") onChange("");
        }}
      />
      <kbd aria-hidden="true">Ctrl K</kbd>
    </div>
  );
}
