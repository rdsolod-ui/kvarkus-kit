import React from "react";
import { initials } from "../model.js";
import "./Avatar.css";

export default function Avatar({ name = "Алина Волкова", tone = "red" }) {
  return (
    <span aria-hidden="true" className={"avatar " + tone}>
      {initials(name)}
    </span>
  );
}
