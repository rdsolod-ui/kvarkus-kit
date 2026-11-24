import React from "react";
import Avatar from "./Avatar.jsx";
import Badge from "./Badge.jsx";
import { money } from "../model.js";
import { ChevronRight } from "lucide-react";
import "./RecordRow.css";

export default function RecordRow({ record, onClick, customer = false }) {
  return (
    <button className="record-row" onClick={onClick}>
      <Avatar name={record.name} tone="violet" />
      <span className="row-copy">
        <strong>{record.name}</strong>
        <small>
          {record.group} · {record.detail}
        </small>
      </span>
      <b>{money(record.value)}</b>
      <Badge
        tone={
          record.status === "VIP"
            ? "violet"
            : ["Бронь", "На согласовании"].includes(record.status)
              ? "gold"
              : "green"
        }
      >
        {record.status}
      </Badge>
      <ChevronRight />
    </button>
  );
}
