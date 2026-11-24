import React from "react";
import Appearance from "./ui/Appearance.jsx";
export default function Shell({ section }) {
  return (
    <header className="site-bar">
      <a href="#screen/overview" className="site-brand">
        <i aria-hidden="true" />
        Кваркус Кит
      </a>
      <nav className="site-links" aria-label="Разделы кита">
        {[
          ["screen", "Рабочий экран", "#screen/overview"],
          ["kit", "Справочник", "#kit"],
          ["map", "Карта", "#map"],
        ].map(([id, label, to]) => (
          <a
            key={id}
            href={to}
            aria-current={section === id ? "page" : undefined}
          >
            {label}
          </a>
        ))}
      </nav>
      <Appearance />
    </header>
  );
}
