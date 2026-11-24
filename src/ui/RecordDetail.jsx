import React from "react";
import Badge from "./Badge.jsx";
import Button from "./Button.jsx";
import { money } from "../model.js";
import "./RecordDetail.css";
export default function RecordDetail({
  record,
  kind,
  customer = false,
  task = false,
  onStatus,
  onMessage,
  onDefer,
  onEdit,
}) {
  const date = record.date?.split("-").reverse().slice(0, 2).join("/");
  const facts = task
    ? [
        ["Тип", record.category],
        ["Срок", date],
        ["Напоминание", record.note || "Ожидает"],
      ]
    : customer
      ? [
          ["Автомобиль", record.vehicle || "—"],
          ["Телефон", record.phone || "—"],
          ["Бюджет", money(record.value)],
          ["Сегмент", record.group],
        ]
      : [
          ["Покупатель", record.buyer || "—"],
          ["Автомобиль", record.vehicle || record.name],
          ["Сумма", money(record.value)],
          ["Дата операции", record.date?.split("-").reverse().join(".") || "—"],
        ];
  return (
    <div className="detail">
      <div className="detail-body">
        <Badge>
          {task ? (record.done ? "Завершён" : record.bucket) : record.status}
        </Badge>
        <strong className="detail-big">
          {task ? date : money(record.value)}
        </strong>
        <p>
          {record.group && record.group + " · "}
          {record.detail}
        </p>
        <dl>
          {facts.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="detail-actions">
        {customer ? (
          <>
            <Button onClick={onMessage}>Написать сообщение</Button>
            <Button variant="quiet" onClick={onStatus}>
              {record.status === "VIP"
                ? "Вернуть в активные"
                : "Отметить как VIP"}
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onStatus}>
              {task
                ? record.done
                  ? "Открыть снова"
                  : "Завершить"
                : ["Выдан", "Оплачен"].includes(record.status)
                  ? "Открыть снова"
                  : kind === "billing"
                    ? "Отметить оплату"
                    : "Оформить выдачу"}
            </Button>
            {task && (
              <Button variant="quiet" onClick={onDefer}>
                Перенести
              </Button>
            )}
            <Button variant="quiet" onClick={onMessage}>
              {task ? "Подготовить напоминание" : "Черновик сообщения"}
            </Button>
          </>
        )}
      </div>
      {onEdit && (
        <details className="edit-extra">
          <summary>Ещё действия</summary>
          <Button variant="quiet" onClick={onEdit}>
            Редактировать
          </Button>
        </details>
      )}
    </div>
  );
}
