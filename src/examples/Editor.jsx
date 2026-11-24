import React, { useState } from "react";
import Editor from "../ui/Editor.jsx";

import "./examples.css";

export default function Example() {
  const [status, setStatus] = useState("");
  return (
    <>
      <Editor
        kind="customers"
        onCancel={() => setStatus("Отменено")}
        onSave={(r) => setStatus("Сохранено · " + r.name)}
      />
      <output>{status}</output>
    </>
  );
}
