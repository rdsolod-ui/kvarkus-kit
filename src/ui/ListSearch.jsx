import React from "react";
import { Search, X } from "lucide-react";
import "./ListSearch.css";

export default function ListSearch({
  value,
  onChange,
  label = "Найти запись",
}) {
  return (
    <label className="list-search">
      <Search aria-hidden="true" />
      <input
        aria-label={label}
        placeholder={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          aria-label="Очистить поиск"
          onClick={() => onChange("")}
        >
          <X />
        </button>
      )}
    </label>
  );
}
