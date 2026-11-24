import React from "react";
import Glass from "./Glass.jsx";
import Brand from "./Brand.jsx";
import SearchTrigger from "./SearchTrigger.jsx";
import NavItem from "./NavItem.jsx";
import PlanCard from "./PlanCard.jsx";
import Profile from "./Profile.jsx";
import {
  House,
  CalendarDays,
  Users,
  CarFront,
  Wallet,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { screens, groups } from "../model.js";
import "./Sidebar.css";

export default function Sidebar({
  page,
  collapsed,
  onCollapse,
  onNavigate,
  onSearch,
  onProfile,
  group,
  onGroup,
  badge = 5,
}) {
  const [expanded, setExpanded] = React.useState(page === "customers");
  React.useEffect(() => {
    if (page === "customers") setExpanded(true);
  }, [page]);
  const [query, setQuery] = React.useState("");
  const icons = [House, CalendarDays, Users, CarFront, Wallet, Settings];
  return (
    <Glass
      as="aside"
      className={
        "side" + (expanded ? " has-subnav" : "") + (collapsed ? " folded" : "")
      }
    >
      <Brand />
      <button
        className="fold"
        onClick={onCollapse}
        aria-label={collapsed ? "Развернуть меню" : "Свернуть меню"}
        aria-expanded={!collapsed}
      >
        {collapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>
      <div
        onClick={() => {
          if (collapsed) onCollapse();
        }}
      >
        <SearchTrigger
          value={query}
          onChange={setQuery}
          onClick={onSearch}
          onEnter={() => {
            const hit = screens.find(([id, label]) =>
              (label + (id === "customers" ? groups.join(" ") : ""))
                .toLowerCase()
                .includes(query.toLowerCase()),
            );
            if (hit) {
              onNavigate(hit[0]);
              setQuery("");
            }
          }}
        />
      </div>
      <nav>
        {screens.map(([id, label], i) => (
          <React.Fragment key={id}>
            {(i === 0 || i === 4) && (
              <p>{i === 0 ? "Основное" : "Управление"}</p>
            )}
            <NavItem
              dim={
                !!query &&
                !(label + (id === "customers" ? groups.join(" ") : ""))
                  .toLowerCase()
                  .includes(query.toLowerCase())
              }
              icon={icons[i]}
              label={label}
              active={page === id}
              onClick={() => {
                if (id === "customers") setExpanded(!expanded);
                onNavigate(id);
              }}
              badge={id === "deals" ? badge : undefined}
              extra={id === "customers" ? <ChevronDown size={12} /> : null}
            />
            {id === "customers" && expanded && !collapsed && (
              <div className="subnav">
                {groups.map((g) => (
                  <button
                    key={g}
                    aria-pressed={g === group}
                    onClick={() => onGroup(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}
      </nav>
      <div className="side-foot">
        <PlanCard />
        <Profile onClick={onProfile} />
      </div>
    </Glass>
  );
}
