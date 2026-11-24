import React from "react";
import { useMotion } from "../motion.js";

import "./Metric.css";

export default function Metric({
  icon: Icon,
  label,
  value,
  change,
  tone = "red",
  onClick,
}) {
  const numberRef = useMotion("value", value);
  const Tag = onClick ? "button" : "div";
  return (
    <Tag className="metric tile" onClick={onClick}>
      <span className="metric-name">
        <i className={"metric-icon " + tone}>
          <Icon aria-hidden="true" />
        </i>
        {label}
      </span>
      <span ref={numberRef} className="metric-value">
        {value}
        {change && <small>{change}</small>}
      </span>
    </Tag>
  );
}
