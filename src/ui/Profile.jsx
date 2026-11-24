import React from "react";
import Avatar from "./Avatar.jsx";
import "./Profile.css";

export default function Profile({
  name = "Алина Волкова",
  role = "Менеджер по продажам",
  onClick,
}) {
  return (
    <button
      className="profile"
      onClick={onClick}
      aria-label={"Профиль · " + name}
    >
      <Avatar name={name} />
      <span>
        <strong>{name}</strong>
        <small>{role}</small>
      </span>
    </button>
  );
}
