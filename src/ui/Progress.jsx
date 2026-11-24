import React from "react";

import "./Progress.css";

export default function Progress({ value = 72, label = "Заполнение" }) {
  return (
    <progress className="progress" value={value} max="100" aria-label={label} />
  );
}
