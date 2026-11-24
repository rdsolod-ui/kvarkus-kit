import React, { useState } from "react";
import Skeleton from "../ui/Skeleton.jsx";
const shapes = {
  workspace: "Рабочий экран",
  overview: "Обзор",
  registry: "Реестр",
  agenda: "Календарь",
  settings: "Настройки",
  guide: "Справочник",
  navigation: "Меню",
  toolbar: "Заголовок и действие",
  form: "Форма",
  metric: "Показатель",
  chart: "График",
  list: "Список",
  row: "Строка",
  text: "Текст",
  avatar: "Аватар",
  button: "Кнопка",
  badge: "Метка",
  input: "Поле",
  ring: "Кольцо",
};
export default function Example() {
  const [kind, set] = useState("overview");
  return (
    <div className="sk-play">
      <label>
        Макет загрузки{" "}
        <select value={kind} onChange={(e) => set(e.target.value)}>
          {Object.entries(shapes).map(([k, v]) => (
            <option value={k} key={k}>
              {v}
            </option>
          ))}
        </select>
      </label>
      <Skeleton key={kind} kind={kind} />
    </div>
  );
}
