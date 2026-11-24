import React from "react";

import "./Glass.css";

export default function Glass({
  as: Tag = "section",
  className = "",
  children,
  ...props
}) {
  return (
    <Tag className={"glass " + className} {...props}>
      {children}
    </Tag>
  );
}
