import React, { useState } from "react";
import CommandSearch from "../ui/CommandSearch.jsx";
import { initialModel } from "../model.js";
import "./examples.css";

export default function Example() {
  const [title, setTitle] = useState("");
  return (
    <>
      <CommandSearch model={initialModel} onSelect={(x) => setTitle(x.title)} />
      <output>{title}</output>
    </>
  );
}
