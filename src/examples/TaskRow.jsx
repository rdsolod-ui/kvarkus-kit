import React, { useState } from "react";
import TaskRow from "../ui/TaskRow.jsx";
import { initialModel } from "../model.js";
import "./examples.css";

export default function Example() {
  const [done, setDone] = useState(false);
  return (
    <TaskRow
      task={{ ...initialModel.tasks[0], done }}
      onToggle={() => setDone(!done)}
      onOpen={() => setDone(!done)}
    />
  );
}
