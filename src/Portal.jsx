import React, { useEffect, useState, lazy } from "react";
import { Plus, Menu, BookOpen, Check } from "lucide-react";
import { LoadingBoundary, skeletonFor } from "./ui/Skeleton.jsx";
import Room from "./ui/Room.jsx";
import Glass from "./ui/Glass.jsx";
import Sidebar from "./ui/Sidebar.jsx";
import Header from "./ui/Header.jsx";
import Button from "./ui/Button.jsx";
import PeriodPicker from "./ui/PeriodPicker.jsx";
const Overview = lazy(() => import("./ui/Overview.jsx"));
const Registry = lazy(() => import("./ui/Registry.jsx"));
const Agenda = lazy(() => import("./ui/Agenda.jsx"));
const SettingsPanel = lazy(() => import("./ui/SettingsPanel.jsx"));
const Editor = lazy(() => import("./ui/Editor.jsx"));
const CommandSearch = lazy(() => import("./ui/CommandSearch.jsx"));
import Dialog from "./ui/Dialog.jsx";
import Toast from "./ui/Toast.jsx";
import Profile from "./ui/Profile.jsx";
const RecordDetail = lazy(() => import("./ui/RecordDetail.jsx"));
import {
  screens,
  readModel,
  storeModel,
  initialModel,
  statuses,
  demoDate,
} from "./model.js";
import { useMotion } from "./motion.js";
import "./portal.css";

const compactQuery = "(max-width:800px),(max-height:540px)";
const actions = {
  overview: "Оформить выдачу",
  agenda: "Добавить задачу",
  customers: "Добавить клиента",
  deals: "Добавить сделку",
  billing: "Выставить счёт",
  settings: "Сохранить изменения",
};
export default function Portal({ page = "overview", onNavigate }) {
  const [model, setModel] = useState(() =>
    onNavigate ? structuredClone(initialModel) : readModel(),
  );
  const sectionRef = useMotion("section", page);
  const [draft, setDraft] = useState(() => ({
    office: model.office,
    preferences: model.preferences,
  }));
  const [collapsed, setCollapsed] = useState(
    () => matchMedia(compactQuery).matches,
  );
  const [period, setPeriod] = useState(0),
    [filter, setFilter] = useState("Все");
  const [panel, setPanel] = useState(null),
    [notice, setNotice] = useState("");
  useEffect(() => {
    if (!onNavigate) storeModel(model);
  }, [model, onNavigate]);
  useEffect(() => {
    const media = matchMedia(compactQuery);
    const adjust = () => setCollapsed(media.matches);
    media.addEventListener("change", adjust);
    return () => media.removeEventListener("change", adjust);
  }, []);
  useEffect(() => {
    const key = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (e.shiftKey) {
          setPanel((p) => (p?.type === "search" ? null : { type: "search" }));
        } else {
          setCollapsed(false);
          requestAnimationFrame(() =>
            document.querySelector(".side .search-trigger input")?.focus(),
          );
        }
      } else if (e.key === "Escape" && matchMedia(compactQuery).matches)
        setCollapsed(true);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 2400);
    return () => clearTimeout(t);
  }, [notice]);
  useEffect(() => {
    setPanel((p) => (p?.fromSearch && p.kind === page ? p : null));
    if (matchMedia(compactQuery).matches) setCollapsed(true);
  }, [page]);
  function navigate(id) {
    setFilter("Все");
    if (id === "settings")
      setDraft({ office: model.office, preferences: model.preferences });
    if (onNavigate) onNavigate(id);
    else location.hash = "screen/" + id;
    if (matchMedia(compactQuery).matches) setCollapsed(true);
  }
  function detail(kind, record) {
    setPanel({ type: "detail", kind, record });
  }
  function edit(kind, record) {
    setPanel({ type: "edit", kind, record });
  }
  function act() {
    if (page === "settings") {
      const form = document.getElementById("office-settings");
      if (form.reportValidity()) {
        setModel((m) => ({ ...m, ...draft }));
        setNotice("Изменения сохранены");
      }
      return;
    }
    edit(page);
  }
  function save(data) {
    const { kind, record } = panel;
    const id = record?.id || crypto.randomUUID();
    setModel((m) => {
      if (kind === "team")
        return {
          ...m,
          team: [
            ...m.team,
            { name: data.name, role: data.role, email: data.email },
          ],
        };
      if (kind === "agenda") {
        const item = {
          category: "Продажа",
          done: false,
          ...record,
          bucket:
            data.date < demoDate
              ? "Просрочено"
              : data.date > "2026-11-29"
                ? "Позже"
                : "На этой неделе",
          ...data,
          id,
        };
        return {
          ...m,
          tasks: record
            ? m.tasks.map((t) => (t.id === id ? item : t))
            : [item, ...m.tasks],
        };
      }
      const table = kind === "overview" ? "deals" : kind;
      const next = {
        status: statuses[table][0],
        ...record,
        ...data,
        id,
      };
      if (kind === "overview") next.status = "Выдан";
      if (table === "customers") {
        next.status = record?.status || "Новый";
        next.detail = data.vehicle;
      } else {
        next.vehicle = table === "deals" ? data.name : data.vehicle;
        next.detail =
          table === "deals"
            ? data.buyer
            : [data.vehicle, data.buyer].filter(Boolean).join(" · ");
      }
      return {
        ...m,
        [table]: record
          ? m[table].map((r) => (r.id === id ? next : r))
          : [next, ...m[table]],
      };
    });
    setPanel(null);
    setNotice(kind === "overview" ? "Автомобиль выдан" : "Запись сохранена");
  }
  const current = screens.find((s) => s[0] === page) || screens[0];
  return (
    <div className="portal" data-page={page}>
      <Room />
      <div className="mobile-top">
        <button aria-label="Меню" onClick={() => setCollapsed(!collapsed)}>
          <Menu />
        </button>
        <span className="mobile-brand">
          <i /> Кваркус Кит
        </span>
        <a href="#kit" aria-label="Библиотека">
          <BookOpen /> Справочник
        </a>
      </div>
      {!collapsed && (
        <button
          aria-label="Закрыть меню"
          className="mobile-shade"
          onClick={() => setCollapsed(true)}
        />
      )}
      <div className={"workspace" + (collapsed ? " compact-side" : "")}>
        <Sidebar
          page={page}
          group={filter}
          badge={model.deals.filter((d) => d.status === "Бронь").length}
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
          onNavigate={navigate}
          onSearch={() => setPanel({ type: "search" })}
          onProfile={() => setPanel({ type: "profile" })}
          onGroup={(g) => {
            if (page !== "customers") {
              navigate("customers");
            }
            setFilter(g);
          }}
        />
        <Glass as="main" ref={sectionRef} className="main-glass">
          <Header
            title={current[1]}
            subtitle={"Вторник, 24 ноября · " + model.office.name}
          >
            {page === "overview" && (
              <PeriodPicker value={period} onChange={setPeriod} />
            )}
            <Button icon={page === "settings" ? Check : Plus} onClick={act}>
              {actions[page]}
            </Button>
          </Header>
          <LoadingBoundary key={page} kind={skeletonFor(page)}>
            {page === "overview" ? (
              <Overview model={model} period={period} onMetric={navigate} />
            ) : (
              <div className="inner-scroll" key={page}>
                {page === "agenda" ? (
                  <Agenda
                    tasks={model.tasks}
                    onToggle={(id) =>
                      setModel((m) => ({
                        ...m,
                        tasks: m.tasks.map((t) =>
                          t.id === id ? { ...t, done: !t.done } : t,
                        ),
                      }))
                    }
                    onOpen={(t) => detail("agenda", t)}
                  />
                ) : page === "settings" ? (
                  <form
                    id="office-settings"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <SettingsPanel
                      draft={draft}
                      setDraft={setDraft}
                      team={model.team}
                      onMemberChange={(i, role) => {
                        if (i === 0) return;
                        setModel((m) => ({
                          ...m,
                          team: role
                            ? m.team.map((t, n) =>
                                n === i ? { ...t, role } : t,
                              )
                            : m.team.filter((_, n) => n !== i),
                        }));
                        setNotice("Состав команды обновлён");
                      }}
                      onInvite={() => edit("team")}
                    />
                  </form>
                ) : (
                  <Registry
                    rows={model[page]}
                    kind={page}
                    customer={page === "customers"}
                    filter={filter}
                    onFilter={setFilter}
                    onOpen={(r) => detail(page, r)}
                  />
                )}
              </div>
            )}
          </LoadingBoundary>
        </Glass>
      </div>
      {["customers", "deals", "billing", "agenda"].includes(page) && (
        <button className="mobile-fab" aria-label={actions[page]} onClick={act}>
          <Plus />
        </button>
      )}
      <a className="kit-link" href="#kit">
        <BookOpen /> Библиотека компонентов
      </a>
      {panel && (
        <Dialog
          sheet={panel.type === "detail"}
          key={panel.type + (panel.record?.id || "")}
          title={
            panel.type === "search"
              ? "Поиск"
              : panel.type === "profile"
                ? "Профиль"
                : panel.record
                  ? panel.record.name
                  : actions[panel.kind] || "Пригласить сотрудника"
          }
          onClose={() => setPanel(null)}
        >
          <LoadingBoundary kind={panel.type === "detail" ? "row" : "form"}>
            {panel.type === "search" ? (
              <CommandSearch
                model={model}
                onSelect={(x) => {
                  navigate(x.page);
                  setPanel(
                    x.record
                      ? {
                          type: "detail",
                          kind: x.page,
                          record: x.record,
                          fromSearch: true,
                        }
                      : null,
                  );
                }}
              />
            ) : panel.type === "profile" ? (
              <>
                <Profile
                  onClick={() => {
                    navigate("settings");
                    setPanel(null);
                  }}
                />
                <footer>
                  <Button
                    onClick={() => {
                      navigate("settings");
                      setPanel(null);
                    }}
                  >
                    Настройки
                  </Button>
                </footer>
              </>
            ) : panel.type === "detail" ? (
              <RecordDetail
                record={panel.record}
                kind={panel.kind}
                task={panel.kind === "agenda"}
                onDefer={() => {
                  const next = new Date(panel.record.date + "T12:00:00Z");
                  next.setUTCDate(next.getUTCDate() + 1);
                  setModel((m) => ({
                    ...m,
                    tasks: m.tasks.map((t) =>
                      t.id === panel.record.id
                        ? {
                            ...t,
                            date: next.toISOString().slice(0, 10),
                            bucket: "На этой неделе",
                          }
                        : t,
                    ),
                  }));
                  setPanel(null);
                  setNotice("Срок перенесён");
                }}
                customer={panel.kind === "customers"}
                onEdit={() => edit(panel.kind, panel.record)}
                onMessage={() => setPanel({ ...panel, type: "message" })}
                onStatus={() => {
                  if (panel.kind === "agenda") {
                    setModel((m) => ({
                      ...m,
                      tasks: m.tasks.map((t) =>
                        t.id === panel.record.id ? { ...t, done: !t.done } : t,
                      ),
                    }));
                    setPanel(null);
                    setNotice("Задача обновлена");
                    return;
                  }
                  const status =
                    panel.kind === "customers"
                      ? panel.record.status === "VIP"
                        ? "Активен"
                        : "VIP"
                      : panel.record.status === statuses[panel.kind][2]
                        ? statuses[panel.kind][0]
                        : statuses[panel.kind][2];
                  setModel((m) => ({
                    ...m,
                    [panel.kind]: m[panel.kind].map((r) =>
                      r.id === panel.record.id
                        ? {
                            ...r,
                            status,
                            ...(panel.kind === "deals"
                              ? { date: demoDate }
                              : {}),
                          }
                        : r,
                    ),
                  }));
                  setPanel(null);
                  setNotice("Статус изменён");
                }}
              />
            ) : panel.type === "message" ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const message = new FormData(e.currentTarget).get("message");
                  setModel((m) => ({
                    ...m,
                    [panel.kind === "agenda" ? "tasks" : panel.kind]: m[
                      panel.kind === "agenda" ? "tasks" : panel.kind
                    ].map((r) =>
                      r.id === panel.record.id ? { ...r, note: message } : r,
                    ),
                  }));
                  setPanel(null);
                  setNotice("Черновик сохранён");
                }}
              >
                <label className="field">
                  Черновик сообщения
                  <textarea
                    name="message"
                    required
                    defaultValue={panel.record.note || ""}
                  />
                </label>
                <footer>
                  <Button type="submit">Сохранить черновик</Button>
                </footer>
              </form>
            ) : (
              <Editor
                kind={panel.kind}
                record={panel.record}
                onSave={save}
                onCancel={() => setPanel(null)}
              />
            )}
          </LoadingBoundary>
        </Dialog>
      )}
      <Toast message={notice} />
    </div>
  );
}
