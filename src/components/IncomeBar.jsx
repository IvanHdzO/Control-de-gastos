import { useState, useRef } from "react";
import { Pencil } from "lucide-react";
import { fmt } from "../lib/format";
import styles from "../styles/styles";

export default function IncomeBar({ income, remaining, onUpdateIncome }) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);

  const save = (value) => {
    onUpdateIncome(parseFloat(value) || 0);
    setEditing(false);
  };

  return (
    <div style={styles.incomeBar} className="card">
      <div style={styles.incomeLeft}>
        <span style={styles.incomeLabel}>Ingreso mensual</span>
        {editing ? (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ color: "#666", fontFamily: "Space Mono" }}>$</span>
            <input
              ref={inputRef}
              type="number"
              defaultValue={income || ""}
              onKeyDown={(e) => {
                if (e.key === "Enter") save(e.target.value);
              }}
              style={styles.incomeInput}
              autoFocus
            />
            <button
              onClick={() => save(inputRef.current?.value)}
              style={styles.smallBtn}
              className="btn-hover"
            >
              Guardar
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={styles.incomeValue}>{fmt(income)}</span>
            <button onClick={() => setEditing(true)} style={styles.editBtn} className="btn-hover">
              <Pencil size={11} style={{ marginRight: 4 }} />
              Editar
            </button>
          </div>
        )}
      </div>
      <div style={styles.incomeDivider} />
      <div style={styles.incomeRight}>
        <span style={styles.incomeLabel}>Disponible</span>
        <span style={{ ...styles.incomeValue, color: remaining >= 0 ? "#4A9B7F" : "#C44A4A", fontSize: 20 }}>
          {fmt(remaining)}
        </span>
      </div>
    </div>
  );
}
