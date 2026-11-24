import React from "react";

import "./SummaryStrip.css";

export default function SummaryStrip({ items, selected = 0, onSelect }) {
  const Tag = onSelect ? "button" : "div";
  return (
    <div className="summary-strip">
      {items.map(({ label, value, detail, progress }, index) => (
        <Tag
          key={index + "-" + label}
          className={"tile" + (index === selected ? " chosen" : "")}
          onClick={onSelect ? () => onSelect(index) : undefined}
          aria-pressed={onSelect ? index === selected : undefined}
        >
          <small>{label}</small>
          <strong>{value}</strong>
          {detail && <span>{detail}</span>}
          {progress != null && (
            <progress aria-label={label} max="100" value={progress} />
          )}
        </Tag>
      ))}
    </div>
  );
}
