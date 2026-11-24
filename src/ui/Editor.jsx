import React from "react";
import Field from "./Field.jsx";
import Button from "./Button.jsx";
import { groups, teamRoles, statuses, demoDate } from "../model.js";
import "./Editor.css";
const deadlines = [
  "Сегодня",
  "Завтра, 25 ноября",
  "Через 3 дня, 27 ноября",
  "На следующей неделе",
];
const dates = [demoDate, "2026-11-25", "2026-11-27", "2026-11-30"];
const categories = ["Тест-драйв", "Продажа", "Трейд-ин", "Выдача"];
export default function Editor({ kind, record = {}, onCancel, onSave }) {
  const task = kind === "agenda",
    team = kind === "team",
    customer = kind === "customers";
  const originalDeadline =
    record.date && (deadlines[dates.indexOf(record.date)] || record.date);
  function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    data.name = data.name.trim();
    if (!data.name) {
      form.elements.name.setCustomValidity("Введите имя или название");
      form.reportValidity();
      return;
    }
    if (task) data.date = dates[deadlines.indexOf(data.when)] || record.date;
    onSave({ ...data, value: Number(data.value ?? record.value ?? 0) });
  }
  return (
    <form className="editor" onSubmit={submit}>
      {kind === "overview" && (
        <p className="editor-intro">
          Выдача появится в сделках и войдёт в объём продаж.
        </p>
      )}
      <div className="editor-fields">
        <Field
          label={
            task
              ? "Название задачи"
              : team || customer
                ? "Имя"
                : kind === "billing"
                  ? "Номер счёта"
                  : "Автомобиль"
          }
          name="name"
          defaultValue={record.name || ""}
          required
          maxLength={80}
          autoFocus
          onInput={(e) => e.target.setCustomValidity("")}
        />
        {task ? (
          <>
            <Field
              label="Описание"
              name="detail"
              defaultValue={record.detail || ""}
            />
            <Field
              label="Тип"
              name="category"
              options={
                record.category && !categories.includes(record.category)
                  ? [record.category, ...categories]
                  : categories
              }
              defaultValue={record.category}
            />
            <Field
              label="Срок"
              name="when"
              defaultValue={originalDeadline}
              options={
                originalDeadline && !deadlines.includes(originalDeadline)
                  ? [originalDeadline, ...deadlines]
                  : deadlines
              }
            />
          </>
        ) : team ? (
          <>
            <Field
              label="Электронная почта"
              name="email"
              type="email"
              required
            />
            <Field label="Роль" name="role" options={teamRoles} />
          </>
        ) : customer ? (
          <>
            <Field
              label="Телефон"
              type="tel"
              name="phone"
              defaultValue={record.phone || ""}
            />
            <Field
              label="Сегмент"
              name="group"
              options={groups}
              defaultValue={record.group}
            />
            <Field
              label="Интересующий автомобиль"
              name="vehicle"
              defaultValue={record.vehicle || ""}
              required
            />
            <Field
              label="Бюджет, ₽"
              name="value"
              type="number"
              min="0"
              step="1"
              defaultValue={record.value ?? ""}
              required
            />
          </>
        ) : (
          <>
            {kind === "billing" && (
              <Field
                label="Автомобиль"
                name="vehicle"
                defaultValue={record.vehicle || ""}
                required
              />
            )}
            <Field
              label="Покупатель"
              name="buyer"
              defaultValue={record.buyer || ""}
              required
            />
            <Field
              label="Сумма, ₽"
              name="value"
              type="number"
              min="1"
              step="1"
              required
              defaultValue={record.value ?? ""}
            />
            <Field
              label="Дата операции"
              name="date"
              type="date"
              defaultValue={record.date || demoDate}
              required
            />
            <Field
              label={kind === "billing" ? "Назначение" : "Сегмент"}
              name="group"
              options={
                kind === "billing"
                  ? ["Покупка автомобиля", "Бронирование"]
                  : groups
              }
              defaultValue={record.group}
            />
            {kind !== "overview" && (
              <Field
                label="Статус"
                name="status"
                options={statuses[kind]}
                defaultValue={record.status}
              />
            )}
          </>
        )}
      </div>
      <footer>
        <Button variant="quiet" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit">{team ? "Пригласить" : "Сохранить"}</Button>
      </footer>
    </form>
  );
}
