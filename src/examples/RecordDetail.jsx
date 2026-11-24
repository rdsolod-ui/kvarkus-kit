import React, { useState } from "react";
import RecordDetail from "../ui/RecordDetail.jsx";
import { initialModel } from "../model.js";
export default function Example() {
  const [record, setRecord] = useState(initialModel.customers[0]),
    [action, setAction] = useState("");
  return (
    <>
      <RecordDetail
        customer
        record={record}
        onEdit={() => setAction("Редактировать")}
        onMessage={() => setAction("Сообщение")}
        onStatus={() =>
          setRecord({
            ...record,
            status: record.status === "VIP" ? "Активен" : "VIP",
          })
        }
      />
      <output>{action}</output>
    </>
  );
}
