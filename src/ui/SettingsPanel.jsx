import React from "react";
import { teamRoles } from "../model.js";
import { ChevronDown } from "lucide-react";
import Field from "./Field.jsx";
import Toggle from "./Toggle.jsx";
import Avatar from "./Avatar.jsx";
import PlanCard from "./PlanCard.jsx";
import Button from "./Button.jsx";
import "./SettingsPanel.css";

export default function SettingsPanel({
  draft,
  setDraft,
  team,
  onInvite,
  onMemberChange,
}) {
  const [member, setMember] = React.useState(null);
  const activeEntry = React.useRef(null);
  React.useEffect(() => {
    if (member == null) return;
    const close = (e) => {
      if (!activeEntry.current?.contains(e.target)) setMember(null);
    };
    const escape = (e) => {
      if (e.key === "Escape") {
        activeEntry.current?.querySelector(".team-person")?.focus();
        setMember(null);
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [member]);
  const labels = [
    ["Срок брони", "Напомнить перед окончанием брони"],
    ["Сводка по почте", "Отправлять утреннюю сводку"],
    ["Напоминания о задачах", "За два дня до срока"],
    ["Входящие документы", "Уведомлять сотрудников"],
  ];
  return (
    <div className="settings">
      <div className="settings-column">
        <section className="settings-card">
          <h2>Автосалон</h2>
          <div className="office-grid">
            {Object.entries({
              name: "Название автосалона",
              email: "Электронная почта",
              phone: "Телефон",
              city: "Город",
            }).map(([k, l]) => (
              <Field
                key={k}
                label={l}
                type={k === "email" ? "email" : "text"}
                required={k === "name" || k === "email"}
                value={draft.office[k]}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    office: { ...draft.office, [k]: e.target.value },
                  })
                }
              />
            ))}
          </div>
        </section>
        <section className="settings-card">
          <h2>Уведомления</h2>
          {labels.map(([label, description], i) => (
            <Toggle
              key={label}
              label={label}
              description={description}
              checked={draft.preferences[i]}
              onChange={(v) =>
                setDraft({
                  ...draft,
                  preferences: draft.preferences.map((x, n) =>
                    n === i ? v : x,
                  ),
                })
              }
            />
          ))}
        </section>
      </div>
      <div className="settings-column">
        <section className="settings-card">
          <header>
            <h2>Команда</h2>
            <Button variant="quiet" onClick={onInvite}>
              Пригласить
            </Button>
          </header>
          {team.map((t, i) => (
            <div
              className="team-entry"
              ref={member === i ? activeEntry : null}
              key={i}
            >
              <button
                type="button"
                disabled={!i}
                className="team-person"
                aria-expanded={i ? member === i : undefined}
                onClick={() => setMember(member === i ? null : i)}
              >
                <Avatar name={t.name} tone="blue" />
                <span>
                  <strong>{t.name}</strong>
                  <small>{t.role}</small>
                </span>
                {i > 0 && <ChevronDown />}
              </button>
              {member === i && (
                <div className="role-menu">
                  {[...teamRoles, "Убрать из команды"].map((role, n) => (
                    <button
                      type="button"
                      key={role}
                      onClick={() => {
                        onMemberChange?.(
                          i,
                          n === teamRoles.length ? null : role,
                        );
                        setMember(null);
                      }}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
        <PlanCard />
      </div>
    </div>
  );
}
