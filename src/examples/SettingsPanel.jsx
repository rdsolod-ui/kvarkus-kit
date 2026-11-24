import React, { useState } from "react";
import SettingsPanel from "../ui/SettingsPanel.jsx";
import { initialModel } from "../model.js";
import "./examples.css";

export default function Example() {
  const [draft, setDraft] = useState(initialModel),
    [team, setTeam] = useState(initialModel.team);
  return (
    <SettingsPanel
      draft={draft}
      setDraft={setDraft}
      team={team}
      onMemberChange={(i, role) =>
        setTeam(
          role
            ? team.map((t, n) => (n === i ? { ...t, role } : t))
            : team.filter((_, n) => n !== i),
        )
      }
      onInvite={() =>
        setTeam([...team, { name: "Новый сотрудник", role: "Команда" }])
      }
    />
  );
}
