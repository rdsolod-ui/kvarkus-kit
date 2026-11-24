import React from "react";

import "./Toggle.css";

export default function Toggle({ label, description, checked, onChange }) {
  return (
    <button
      className="toggle"
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
    >
      <span>
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
      <i aria-hidden="true" />
    </button>
  );
}
