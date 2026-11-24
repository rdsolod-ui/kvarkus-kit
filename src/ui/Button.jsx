import React from "react";

import "./Button.css";

export default function Button({
  children,
  icon: Icon,
  variant = "primary",
  ...props
}) {
  return (
    <button type="button" className={"action " + variant} {...props}>
      {Icon && <Icon aria-hidden="true" />}
      {children}
    </button>
  );
}
