import React, { Suspense } from "react";
import "./Skeleton.css";

const bars = [34, 57, 45, 74, 64, 87, 71, 93];
function Shape({ type = "text" }) {
  return <i className={"sk-shape sk-" + type} />;
}
function Piece({ type }) {
  switch (type) {
    case "chart":
      return (
        <div className="sk-card">
          <Shape type="title" />
          <div className="sk-plot">
            {bars.map((height, i) => (
              <i
                key={i}
                className="sk-shape"
                style={{ height: height + "%" }}
              />
            ))}
          </div>
        </div>
      );
    case "metric":
      return (
        <div className="sk-card">
          <Shape type="text" />
          <Shape type="number" />
        </div>
      );
    case "row":
      return (
        <div className="sk-row">
          <Shape type="avatar" />
          <div>
            <Shape type="title" />
            <Shape />
          </div>
          <Shape type="badge" />
        </div>
      );
    case "form":
      return (
        <div className="sk-card sk-form">
          {[0, 1, 2, 3].map((i) => (
            <div key={i}>
              <Shape type="text" />
              <Shape type="input" />
            </div>
          ))}
        </div>
      );
    case "navigation":
      return (
        <div className="sk-card">
          <Shape type="title" />
          {[0, 1, 2, 3, 4].map((i) => (
            <Shape type="input" key={i} />
          ))}
        </div>
      );
    case "toolbar":
      return (
        <div className="sk-tools">
          <Shape type="title" />
          <Shape type="button" />
        </div>
      );
    case "list":
      return (
        <div className="sk-card">
          <Piece type="toolbar" />
          {[0, 1, 2, 3, 4].map((i) => (
            <Piece type="row" key={i} />
          ))}
        </div>
      );
    case "overview":
      return (
        <>
          <div className="sk-metrics">
            {[0, 1, 2].map((i) => (
              <Piece type="metric" key={i} />
            ))}
          </div>
          <div className="sk-plots">
            <Piece type="chart" />
            <div className="sk-card">
              <Shape type="title" />
              <Shape type="ring" />
            </div>
          </div>
        </>
      );
    case "registry":
    case "agenda":
      return (
        <>
          <div className="sk-metrics">
            {[0, 1, 2].map((i) => (
              <Piece type="metric" key={i} />
            ))}
          </div>
          <Piece type="list" />
        </>
      );
    case "settings":
      return (
        <div className="sk-plots">
          <Piece type="form" />
          <Piece type="list" />
        </div>
      );
    case "guide":
      return (
        <div className="sk-layout">
          <Piece type="navigation" />
          <div>
            <Piece type="toolbar" />
            <Piece type="chart" />
            <Piece type="row" />
          </div>
        </div>
      );
    case "workspace":
      return (
        <div className="sk-layout">
          <Piece type="navigation" />
          <div>
            <Piece type="toolbar" />
            <Piece type="overview" />
          </div>
        </div>
      );
    default:
      return <Shape type={type} />;
  }
}
export function skeletonFor(id = "") {
  const groups = {
    overview: ["overview", "Overview", "ScreenOverview"],
    registry: [
      "deals",
      "customers",
      "billing",
      "Registry",
      "ScreenDeals",
      "ScreenCustomers",
      "ScreenBilling",
    ],
    agenda: ["agenda", "Agenda", "ScreenAgenda"],
    settings: ["settings", "SettingsPanel", "ScreenSettings"],
    row: ["RecordRow", "TaskRow", "Profile", "RecordDetail", "NavItem"],
    form: ["Editor", "Dialog", "Field", "CommandSearch"],
    metric: ["Metric", "SummaryStrip", "PlanCard"],
    navigation: ["Sidebar"],
    chart: ["Bars", "Ring"],
    toolbar: ["Header", "Tabs", "Appearance"],
    button: ["Button", "Toggle", "SearchTrigger", "PeriodPicker"],
    avatar: ["Avatar", "Brand"],
    badge: ["Badge", "Toast"],
    input: ["ListSearch", "Progress"],
  };
  return (
    Object.keys(groups).find((k) => groups[k].includes(id)) ||
    (id.startsWith("Chart") ? "chart" : "text")
  );
}
export default function Skeleton({
  kind = "overview",
  label = "Загрузка содержимого",
}) {
  return (
    <div className={"sk sk-kind-" + kind} role="status" aria-label={label}>
      <div aria-busy="true" aria-hidden="true">
        <Piece type={kind} />
      </div>
    </div>
  );
}
export class LoadError extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError?.();
  }
  render() {
    if (this.state.failed)
      return (
        <div role="alert" className="load-error">
          <p>Не удалось открыть содержимое.</p>
          <button type="button" onClick={() => location.reload()}>
            Обновить страницу
          </button>
        </div>
      );
    return this.props.children;
  }
}
export function LoadingBoundary({ kind, children, onError }) {
  return (
    <LoadError onError={onError}>
      <Suspense fallback={<Skeleton kind={kind} />}>{children}</Suspense>
    </LoadError>
  );
}
