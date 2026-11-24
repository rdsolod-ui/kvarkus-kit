// Produce the public map from rendered element inventories captured in an isolated browser.
import fs from "node:fs";
import path from "node:path";
const dir = process.argv[2];
if (!dir)
  throw Error("Pass the directory with paired ref- and kit- inventories.");
const stateNames = {
  overview: "Обзор",
  agenda: "Расписание",
  patients: "Пациенты",
  authorizations: "Разрешения",
  billing: "Счета",
  settings: "Настройки",
  renew: "Продление направления",
  period: "Меню периодов",
  search: "Поиск с клавиатуры",
  "search-filled": "Фильтр меню",
  "patient-detail": "Карточка пациента",
  "auth-detail": "Карточка разрешения",
  "billing-detail": "Карточка счёта",
  "agenda-detail": "Карточка срока",
  "bar-detail": "Подсказка столбца",
  folded: "Свёрнутое меню",
  invite: "Приглашение в команду",
  team: "Меню участника",
  "period-1": "Последние 7 дней",
  "period-2": "Последние 30 дней",
  "period-3": "Последние 90 дней",
  mobile: "Обзор",
  tablet: "Обзор",
  "mobile-drawer": "Мобильное меню",
};
const baseNames = {
  agenda: "срока",
  patients: "пациента",
  authorizations: "разрешения",
  billing: "счёта",
};
for (const [id, label] of Object.entries(baseNames)) {
  stateNames[id + "-new"] = "Создание " + label;
  stateNames[id + "-filtered"] = stateNames[id] + " · первый фильтр";
}
for (const id of [
  "agenda",
  "patients",
  "authorizations",
  "billing",
  "settings",
])
  stateNames["mobile-" + id] = stateNames[id];
stateNames.toast = "Сохранение настроек";
stateNames.commands = "Поиск по записям кита";
stateNames.profile = "Действие профиля";
const filters = {
  agenda: ["Сегодня", "На этой неделе", "Завершены"],
  patients: ["VIP", "Новые"],
  authorizations: ["Ожидают", "Завершены"],
  billing: ["Ожидают", "Завершены"],
};
for (const [screen, labels] of Object.entries(filters)) {
  labels.forEach(
    (label, index) =>
      (stateNames[screen + "-filter-" + (index + 2)] =
        stateNames[screen] + " · " + label),
  );
}
["Guias", "Convênios", "Glosas"].forEach(
  (label, index) =>
    (stateNames["patients-group-" + (index + 1)] = "Пациенты · " + label),
);
const routes = {
  overview: "overview",
  toast: "settings",
  "patient-detail": "patients",
  "auth-detail": "authorizations",
  "billing-detail": "billing",
  "agenda-detail": "agenda",
  invite: "settings",
  team: "settings",
  "mobile-drawer": "settings",
};
const items = [];
function has(e, c) {
  return e.cls.split(" ").includes(c);
}
const get = (arr, sel) =>
  typeof sel === "function"
    ? arr.filter(sel)
    : arr.filter((e) =>
        sel[0] === "#"
          ? e.id === sel.slice(1)
          : sel[0] === "."
            ? has(e, sel.slice(1))
            : e.tag === sel,
      );
const inside = (e, p) =>
  p &&
  e !== p &&
  e.b[0] >= p.b[0] - 1 &&
  e.b[1] >= p.b[1] - 1 &&
  e.b[0] + e.b[2] <= p.b[0] + p.b[2] + 1 &&
  e.b[1] + e.b[3] <= p.b[1] + p.b[3] + 1;
function nested(arr, parent, sel) {
  return get(arr, sel).filter((e) => inside(e, parent));
}
for (const [id, title] of Object.entries(stateNames)) {
  const read = (side) =>
    JSON.parse(
      fs.readFileSync(
        path.join(
          dir,
          side + "-" + (id === "mobile" ? "mobile-overview" : id) + ".json",
        ),
        "utf8",
      ),
    );
  const a = id === "commands" ? [] : read("ref"),
    b = read("kit"),
    phone = id.startsWith("mobile") || id === "tablet";
  const size = phone ? [id === "tablet" ? 768 : 390, 844] : [1440, 900];
  const rows = [];
  const one = (key, label, component, r, k, note) => {
    if (!r && !k) return;
    rows.push({
      id: key,
      label,
      component,
      ref: r?.b || null,
      kit: k?.b || null,
      ...(note ? { note } : {}),
    });
  };
  function many(key, label, component, r, k, note, limit = Infinity) {
    const n = Math.min(limit, Math.max(r.length, k.length));
    for (let i = 0; i < n; i++)
      one(
        key + (n > 1 ? "-" + (i + 1) : ""),
        label + (n > 1 ? " " + (i + 1) : ""),
        component,
        r[i],
        k[i],
        note,
      );
  }
  const pair = (key, label, component, r, k, note) =>
    one(key, label, component, get(a, r)[0], get(b, k)[0], note);
  const all = (key, label, component, r, k, note) =>
    many(key, label, component, get(a, r), get(b, k), note);
  const route = routes[id] || id.replace(/^mobile-/, "").split("-")[0];
  const screen = [
    "agenda",
    "patients",
    "authorizations",
    "billing",
    "settings",
  ].includes(route)
    ? route
    : "overview";
  const standard =
    [
      "overview",
      "agenda",
      "patients",
      "authorizations",
      "billing",
      "settings",
      "mobile",
      "tablet",
      "folded",
      "mobile-drawer",
    ].includes(id) || id.startsWith("mobile-");
  if (standard || id === "search" || id === "search-filled") {
    pair(
      "material",
      "Фоновый интерьер",
      "Room",
      "#nva-bg",
      ".room",
      "В ките используется собственная проекция фотографии Poly Haven.",
    );
    pair("glass", "Рабочая панель", "Glass", "#main", ".main-glass");
    pair("header", "Шапка экрана", "Header", ".hd", ".screen-head");
    one(
      "date",
      "Дата и название клиники",
      "Header",
      get(a, ".dt")[0],
      get(b, (e) => e.tag === "p" && e.txt.startsWith("Sábado,"))[0],
    );
    pair("title", "Заголовок", "Header", "#ptitle", "h1");
    pair(
      "primary",
      "Основное действие",
      "Button",
      phone &&
        ["patients", "billing", "authorizations", "agenda"].includes(screen)
        ? ".pg-fab"
        : ".btn",
      phone &&
        ["patients", "billing", "authorizations", "agenda"].includes(screen)
        ? ".mobile-fab"
        : (e) => has(e, "primary") && !has(e, "tile"),
    );
    if (phone) {
      pair(
        "mobile-header",
        "Верхнее меню",
        "Sidebar",
        "#nva-top",
        ".mobile-top",
      );
      one(
        "burger",
        "Открытие меню",
        "Sidebar",
        get(a, "#nva-burger")[0],
        nested(b, get(b, ".mobile-top")[0], "button")[0],
      );
    }
    if (!phone || id === "mobile-drawer") {
      pair("sidebar", "Боковая панель", "Sidebar", "#sb", ".side");
      pair(
        "brand",
        "Знак клиники",
        "Brand",
        ".lg",
        ".brand",
        "Собственный знак и название.",
      );
      pair(
        "query",
        "Быстрый поиск",
        "SearchTrigger",
        "#srch",
        ".search-trigger",
      );
      pair("collapse", "Кнопка сворачивания", "Sidebar", "#tgl", ".fold");
      all("navigation", "Пункт меню", "NavItem", ".it", ".nav-item");
      many(
        "sub",
        "Вложенный пункт",
        "NavItem",
        get(a, ".si"),
        nested(b, get(b, ".subnav")[0], "button"),
      );
      pair(
        "plan",
        "План клиники",
        "PlanCard",
        "#up",
        (e) => has(e, "plan-card") && e.b[0] === get(b, ".profile")[0]?.b[0],
      );
      one(
        "plan-progress",
        "Заполнение плана",
        "Progress",
        nested(a, get(a, "#up")[0], ".bar")[0],
        nested(b, get(b, ".side")[0], "progress")[0],
      );
      pair("profile", "Профиль", "Profile", "#me", ".profile");
      one(
        "avatar",
        "Инициалы специалиста",
        "Avatar",
        nested(a, get(a, "#me")[0], ".av")[0],
        nested(b, get(b, ".profile")[0], ".avatar")[0],
      );
    }
  }
  if (
    screen === "overview" &&
    (standard || id.startsWith("period-") || id === "bar-detail")
  ) {
    pair("grid", "Сетка обзора", "Overview", "#bento", ".overview");
    pair(
      "period",
      "Выбор периода",
      "PeriodPicker",
      ".ghost",
      ".period-trigger",
    );
    all("kpi", "Показатель", "Metric", (e) => /^k\d$/.test(e.id), ".metric");
    all("kpi-label", "Название показателя", "Metric", ".l", ".metric-name");
    all("kpi-value", "Значение показателя", "Metric", ".v", ".metric-value");
    all(
      "kpi-symbol",
      "Значок показателя",
      "Metric",
      (e) => e.tag === "i" && get(a, ".l").some((p) => inside(e, p)),
      ".metric-icon",
    );
    many(
      "kpi-change",
      "Изменение показателя",
      "Metric",
      get(a, ".d"),
      get(b, ".metric-value").map((p) => nested(b, p, "small")[0]),
    );
    pair(
      "ring-caption",
      "Подпись количества",
      "Ring",
      (e) => e.tag === "div" && /^\d+ de \d+ guias$/.test(e.txt),
      (e) => e.tag === "small" && /^\d+ de \d+ guias$/.test(e.txt),
    );
    pair(
      "histogram",
      "Контейнер столбчатой диаграммы",
      "Bars",
      "#bars",
      ".bars-box",
    );
    pair(
      "histogram-title",
      "Название графика",
      "Bars",
      "#btitle",
      (e) => e.tag === "h2" && e.txt.startsWith("Guias"),
    );
    one(
      "peak",
      "Метка пика",
      "Badge",
      get(a, "div").find((e) => e.txt.startsWith("Pico em") && e.b[2] < 160),
      nested(b, get(b, ".bars-box")[0], ".badge")[0],
    );
    const columns = get(b, ".bar-track").map((p) =>
      nested(b, p, "i").find((e) => e.cls === ""),
    );
    many(
      "bar",
      "Столбец",
      "Bars",
      get(a, (e) => /^bb\d+$/.test(e.id)),
      columns,
    );
    many(
      "tick",
      "Подпись даты",
      "Bars",
      get(
        a,
        (e) =>
          e.tag === "span" &&
          e.b[1] === get(a, "#blb")[0]?.b[1] &&
          /^\d{2}\/\d{2}$/.test(e.txt),
      ),
      get(b, ".bar-column").map((p) => nested(b, p, "span").at(-1)),
    );
    pair("ring", "Кольцевая диаграмма", "Ring", "#ring", ".ring-box");
    one(
      "ring-value",
      "Процент",
      "Ring",
      get(a, "#rv")[0],
      nested(b, get(b, ".ring")[0], "b")[0],
    );
  }
  if (
    ["agenda", "patients", "authorizations", "billing"].includes(screen) &&
    (standard ||
      id.endsWith("filtered") ||
      id.includes("-filter-") ||
      id.includes("-group-"))
  ) {
    const agenda = screen === "agenda";
    pair(
      "content",
      "Содержимое экрана",
      agenda ? "Agenda" : "Registry",
      "#pgv",
      agenda ? ".agenda" : ".registry",
    );
    pair(
      "stats",
      "Полоса сводки",
      "SummaryStrip",
      ".pg-tiles",
      ".summary-strip",
    );
    const strip = get(b, ".summary-strip")[0];
    many(
      "summary",
      "Фильтр сводки",
      "SummaryStrip",
      get(a, ".pg-tile"),
      get(b, ".tile").filter(
        (e) => strip && e.b[1] >= strip.b[1] - 2 && e.b[1] < strip.b[1] + 8,
      ),
    );
    pair(
      "container",
      "Карточка списка",
      agenda ? "Agenda" : "Registry",
      ".pg-card",
      agenda ? ".agenda-list" : ".records",
    );
    pair(
      "tools",
      "Панель фильтра",
      agenda ? "Agenda" : "Registry",
      ".pg-tb",
      agenda ? ".task-tools" : ".list-tools",
    );
    pair("find", "Поиск записей", "ListSearch", ".pg-q", ".list-search");
    pair(
      "scroll",
      "Прокручиваемые строки",
      agenda ? "Agenda" : "Registry",
      ".pg-rows",
      agenda ? ".task-scroll" : ".record-scroll",
    );
    all(
      "record-caption",
      "Название и описание записи",
      agenda ? "TaskRow" : "RecordRow",
      ".pg-main",
      agenda ? ".task-name" : ".row-copy",
    );
    if (!agenda)
      many(
        "amount",
        "Сумма записи",
        "RecordRow",
        get(a, ".pg-v"),
        get(b, ".record-row").map((p) => nested(b, p, "b")[0]),
      );
    if (agenda) {
      all(
        "group",
        "Группа сроков",
        "Agenda",
        ".pg-gh",
        (e) => e.tag === "h2" && e.b[0] > 0,
      );
      all("task", "Строка срока", "TaskRow", ".pg-row", ".task-row");
      all("check", "Отметка выполнения", "TaskRow", ".pg-ck", ".task-check");
    } else {
      all("record", "Строка записи", "RecordRow", ".pg-row", ".record-row");
      many(
        "initials",
        "Инициалы",
        "Avatar",
        get(a, ".pg-av"),
        get(b, ".record-row").map((p) => nested(b, p, ".avatar")[0]),
      );
      many(
        "status",
        "Статус",
        "Badge",
        get(a, ".pg-pill"),
        get(b, ".record-row").map((p) => nested(b, p, ".badge")[0]),
      );
      if (screen === "patients") {
        pair("tabs", "Фильтр по группе", "Tabs", ".pg-chips", ".pills");
        many(
          "tab",
          "Кнопка группы",
          "Tabs",
          get(a, ".pg-chip"),
          get(
            b,
            (e) =>
              e.tag === "button" &&
              /^((Todos)|(Guias)|(Convênios)|(Glosas))\d/.test(e.txt),
          ),
        );
      }
    }
  }
  if (screen === "settings" && standard) {
    pair(
      "settings",
      "Настройки клиники",
      "SettingsPanel",
      ".pg-set",
      ".settings",
    );
    all(
      "column",
      "Колонка настроек",
      "SettingsPanel",
      ".pg-col",
      ".settings-column",
    );
    many(
      "card",
      "Раздел настроек",
      "SettingsPanel",
      get(a, ".pg-sec").filter((e) => !has(e, "pg-plan")),
      get(b, ".settings-card"),
    );
    all("field", "Поле организации", "Field", ".nva-fl", ".field");
    all("toggle", "Настройка уведомлений", "Toggle", ".pg-tg", ".toggle");
    all("member", "Участник команды", "Avatar", ".pg-mb", ".team-person");
    pair(
      "capacity",
      "Тариф и загрузка",
      "PlanCard",
      ".pg-plan",
      (e) => has(e, "plan-card") && inside(e, get(b, ".settings")[0]),
    );
  }
  if (id === "period" || id === "team") {
    const r = get(a, ".nva-menu").at(-1),
      k = get(b, id === "period" ? ".period-menu" : ".role-menu").at(-1);
    one(
      "menu",
      "Раскрытое меню",
      id === "period" ? "PeriodPicker" : "SettingsPanel",
      r,
      k,
    );
    many(
      "option",
      "Пункт меню",
      id === "period" ? "PeriodPicker" : "SettingsPanel",
      nested(a, r, "button"),
      nested(b, k, (e) => e.tag === "button" && !has(e, "team-person")),
    );
  }
  if (id === "bar-detail")
    pair("tooltip", "Подсказка даты и суммы", "Bars", ".nva-bt", ".bar-tip");
  if (
    ["renew", "invite"].includes(id) ||
    id.endsWith("-new") ||
    (id.endsWith("-detail") && id !== "bar-detail")
  ) {
    const sheet = id.endsWith("-detail"),
      r = get(a, sheet ? ".nva-sh" : ".nva-dlg").at(-1),
      k = get(b, "dialog").at(-1);
    one("dialog", sheet ? "Правая панель" : "Диалог", "Dialog", r, k);
    one(
      "heading",
      "Заголовок диалога",
      "Dialog",
      nested(a, r, ".nva-dh")[0],
      nested(b, k, "header")[0],
    );
    one(
      "close",
      "Кнопка закрытия",
      "Dialog",
      nested(a, r, ".nva-x")[0],
      nested(b, k, ".close")[0],
    );
    if (sheet) {
      one(
        "body",
        "Данные записи",
        "RecordDetail",
        nested(a, r, ".nva-sb")[0],
        nested(b, k, ".detail-body")[0],
      );
      many(
        "fact",
        "Поле карточки",
        "RecordDetail",
        nested(a, r, ".row"),
        nested(b, k, "dt").map((e) =>
          get(b, "div").find(
            (p) => inside(e, p) && p.b[3] < 60 && p.b[2] > 200,
          ),
        ),
      );
    } else {
      one(
        "fields",
        "Форма",
        "Editor",
        nested(a, r, ".nva-fs")[0],
        nested(b, k, ".editor-fields")[0],
      );
      many(
        "field",
        "Поле формы",
        "Field",
        nested(a, r, ".nva-fl"),
        nested(b, k, ".field"),
      );
    }
    many(
      "action",
      "Действие",
      "Button",
      nested(a, r, (e) => has(e, "nva-b1") || has(e, "nva-b2")),
      nested(
        b,
        sheet ? nested(b, k, ".detail-actions")[0] : nested(b, k, "footer")[0],
        "button",
      ),
    );
  }
  if (id === "toast")
    pair(
      "toast",
      "Подтверждение сохранения",
      "Toast",
      (e) => e.tag === "div" && e.txt === "Alterações salvas",
      ".toast",
    );
  if (id === "commands")
    one(
      "palette",
      "Поиск по страницам и записям",
      "CommandSearch",
      null,
      get(b, ".command")[0],
      "Дополнительная команда кита по Ctrl + Shift + K. В демо Ctrl + K активирует поиск в боковом меню.",
    );
  if (id === "profile") {
    pair("profile", "Профиль в боковой панели", "Profile", "#me", ".profile");
    one(
      "profile-dialog",
      "Диалог профиля",
      "Dialog",
      null,
      get(b, "dialog")[0],
      "При проверке нажатие на профиль в демо оставило обзор открытым. В ките есть дополнительный переход в настройки.",
    );
  }
  for (const r of rows) {
    if (r.id.startsWith("navigation-"))
      r.label =
        ["Обзор", "Расписание", "Пациенты", "Разрешения", "Счета", "Настройки"][
          Number(r.id.split("-")[1]) - 1
        ] + " · пункт меню";
    if (r.id.startsWith("tick-") || r.id.startsWith("bar-"))
      r.label += (
        [
          "25/11",
          "30/11",
          "05/12",
          "10/12",
          "15/12",
          "20/12",
          "25/12",
          "31/12",
        ][Number(r.id.split("-")[1]) - 1] || ""
      ).replace(/^(.+)$/, " · $1");
    if (r.id.startsWith("fact-")) {
      const fact = get(a, ".row")[Number(r.id.split("-")[1]) - 1];
      if (fact) r.label = fact.txt.split("\n")[0];
    }
    if (r.id.startsWith("field-") && !standard) {
      const fld = get(a, ".nva-fl")[Number(r.id.split("-")[1]) - 1];
      if (fld) r.label = fld.txt.split("\n")[0];
    }
  }
  if (!rows.length) throw Error("Empty state " + id);
  const direct = {
    renew: "В обзоре нажмите Renovar guia.",
    period: "Нажмите кнопку периода рядом с Renovar guia.",
    search: "Откройте обзор и нажмите Ctrl + K.",
    "search-filled": "Введите gui в поле поиска бокового меню.",
    "bar-detail":
      "Наведите указатель на первый столбец графика или выберите его.",
    folded: "Нажмите стрелку на правом краю боковой панели.",
    invite: "В настройках нажмите Convidar.",
    team: "В настройках выберите второго участника команды.",
    toast: "В настройках нажмите Salvar alterações.",
    commands: "В ките нажмите Ctrl + Shift + K.",
    profile: "Нажмите на профиль внизу бокового меню.",
    "mobile-drawer":
      "Откройте настройки и нажмите кнопку меню в верхнем левом углу.",
  };
  let trigger = direct[id] || "Откройте раздел «" + stateNames[screen] + "».";
  if (id.startsWith("period-"))
    trigger =
      "Откройте меню периода и выберите «" +
      ["", "Últimos 7 dias", "Últimos 30 dias", "Últimos 90 dias"][
        Number(id.at(-1))
      ] +
      "».";
  if (id.endsWith("-new")) trigger += " Нажмите основную кнопку создания.";
  if (id.endsWith("-detail") && id !== "bar-detail")
    trigger += " Выберите первую строку списка.";
  if (id.endsWith("-filtered") || id.includes("-filter-")) {
    const i = id.endsWith("-filtered") ? 1 : Number(id.at(-1));
    trigger +=
      " Нажмите карточку сводки «" +
      (get(a, ".pg-tile")[i]?.txt.split("\n")[0] || "") +
      "».";
  }
  if (id.includes("-group-"))
    trigger +=
      " Выберите группу «" +
      ["", "Guias", "Convênios", "Glosas"][Number(id.at(-1))] +
      "».";
  items.push({
    id,
    title,
    trigger,
    screen,
    width: size[0],
    height: size[1],
    rows,
  });
}
fs.writeFileSync(
  "src/reference-map.json",
  JSON.stringify({ version: "1.1.0", states: items }) + "\n",
);
console.log(
  items.length,
  "states;",
  items.reduce((s, i) => s + i.rows.length, 0),
  "mapped observations",
);
