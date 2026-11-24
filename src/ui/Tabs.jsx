import React from "react";

import "./Tabs.css";

export default function Tabs({ items, value, onChange, counts }) {
  return (
    <div className="pills" aria-label="Фильтры">
      {items.map((item) => (
        <button
          key={item}
          aria-pressed={item === value}
          onClick={() => onChange(item)}
        >
          {item}
          {counts && <small>{counts[item] || 0}</small>}
        </button>
      ))}
    </div>
  );
}
