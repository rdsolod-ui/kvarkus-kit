import React from "react";

import "./Header.css";

export default function Header({ title, subtitle, children }) {
  return (
    <header className="screen-head">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="screen-actions">{children}</div>
    </header>
  );
}
