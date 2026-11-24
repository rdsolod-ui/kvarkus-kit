import React, { useState } from "react";
import Dialog from "../ui/Dialog.jsx";
import Button from "../ui/Button.jsx";
import "./examples.css";

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Открыть диалог</Button>
      {open && (
        <Dialog title="Оформить выдачу" onClose={() => setOpen(false)}>
          <Button onClick={() => setOpen(false)}>Закрыть</Button>
        </Dialog>
      )}
    </>
  );
}
