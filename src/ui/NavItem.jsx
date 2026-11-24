import React from "react";

import "./NavItem.css";

export default function NavItem({
  icon: Icon,
  dim = false,
  label,
  active = false,
  badge,
  extra,
  onClick,
}) {
  return (
    <button
      className={"nav-item" + (dim ? " dim" : "") + (active ? " active" : "")}
      aria-current={active ? "page" : undefined}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      <Icon aria-hidden="true" />
      <span>{label}</span>
      {badge != null && <b>{badge}</b>}
      {extra}
    </button>
  );
}
