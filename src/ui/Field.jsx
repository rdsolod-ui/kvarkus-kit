import React from "react";

import "./Field.css";

export default function Field({ label, options, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      {options ? (
        <select {...props}>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input {...props} />
      )}
    </label>
  );
}
