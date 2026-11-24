import React, { useState } from "react";
import Profile from "../ui/Profile.jsx";
import Dialog from "../ui/Dialog.jsx";
import "./examples.css";

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Profile onClick={() => setOpen(true)} />
      {open && (
        <Dialog title="Профиль" onClose={() => setOpen(false)}>
          Алина Волкова · менеджер по продажам
        </Dialog>
      )}
    </>
  );
}
