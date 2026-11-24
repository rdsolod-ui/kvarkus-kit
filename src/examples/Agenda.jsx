import React, { useState } from "react";
import Agenda from "../ui/Agenda.jsx";
import { initialModel } from "../model.js";
import "./examples.css";

export default function Example() {
  const [tasks, setTasks] = useState(initialModel.tasks),
    [name, setName] = useState("");
  return (
    <>
      <Agenda
        tasks={tasks}
        onToggle={(id) =>
          setTasks(
            tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
          )
        }
        onOpen={(t) => setName(t.name)}
      />
      <output>{name}</output>
    </>
  );
}
