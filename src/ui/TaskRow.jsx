import React from "react";
import { Circle, CheckCircle2 } from "lucide-react";
import Badge from "./Badge.jsx";
import "./TaskRow.css";

export default function TaskRow({ task, onToggle, onOpen }) {
  const Icon = task.done ? CheckCircle2 : Circle;
  return (
    <div className="task-row">
      <button
        className="task-check"
        aria-label={"Завершить · " + task.name}
        aria-pressed={task.done}
        onClick={onToggle}
      >
        <Icon />
      </button>
      <button className="task-name" onClick={onOpen}>
        <strong>{task.name}</strong>
        <small>
          {task.detail || task.category}
        </small>
      </button>
      <Badge tone="neutral">{task.category}</Badge>
      <Badge
        tone={
          task.done ? "green" : task.bucket === "Просрочено" ? "violet" : "gold"
        }
      >
        {task.done
          ? "Завершён"
          : task.date.slice(8) + "/" + task.date.slice(5, 7)}
      </Badge>
    </div>
  );
}
