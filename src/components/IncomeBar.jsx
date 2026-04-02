import { useState, useRef } from "react";
import { Pencil, Plus, Trash2, Users, Gift } from "lucide-react";
import { fmt } from "../lib/format";
import styles from "../styles/styles";

function InlineEdit({ label, value, onSave, color }) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);

  const save = (v) => {
    onSave(parseFloat(v) || 0);
    setEditing(false);
  };

  return (
    <div style={{ marginBottom: 4 }}>
      <span style={styles.incomeLabel}>{label}</span>
      {editing ? (
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: "#666", fontFamily: "Space Mono", fontSize: 14 }}>$</span>
          <input
            ref={inputRef}
            type="number"
            defaultValue={value || ""}
            onKeyDown={(e) => { if (e.key === "Enter") save(e.target.value); }}
            style={{ ...styles.incomeInput, fontSize: 16, maxWidth: 130 }}
            autoFocus
          />
          <button onClick={() => save(inputRef.current?.value)} style={styles.smallBtn} className="btn-hover">OK</button>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ ...styles.incomeValue, fontSize: 18, color: color || "#fff" }} className="r-income-value">{fmt(value)}</span>
          <button onClick={() => setEditing(true)} style={styles.editBtn} className="btn-hover">
            <Pencil size={10} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function IncomeBar({
  income, income2, totalBonuses, totalIncome, remaining,
  onUpdateIncome, onUpdateIncome2,
  bonuses, onAddBonus, onDeleteBonus,
}) {
  const [showBonusForm, setShowBonusForm] = useState(false);
  const [bonusDesc, setBonusDesc] = useState("");
  const [bonusAmount, setBonusAmount] = useState("");

  const handleAddBonus = () => {
    if (!bonusDesc || !bonusAmount) return;
    onAddBonus(bonusDesc, bonusAmount);
    setBonusDesc("");
    setBonusAmount("");
    setShowBonusForm(false);
  };

  return (
    <div style={{ background: "#131316", border: "1px solid #1E1E22", borderRadius: 14, padding: "20px 24px", marginBottom: 20 }} className="card">
      {/* Salarios */}
      <div style={{ display: "flex", gap: 24, marginBottom: 16, flexWrap: "wrap" }} className="r-income-bar">
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Users size={14} color="#7CC6E8" />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#7CC6E8", fontFamily: "Space Mono" }}>Salarios</span>
          </div>
          <InlineEdit label="Tu salario" value={income} onSave={onUpdateIncome} color="#fff" />
          <InlineEdit label="Salario esposa" value={income2} onSave={onUpdateIncome2} color="#fff" />
        </div>

        <div style={{ width: 1, background: "#222", alignSelf: "stretch" }} className="r-income-divider" />

        {/* Bonos */}
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Gift size={14} color="#E8D07C" />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#E8D07C", fontFamily: "Space Mono" }}>Bonos / Extras</span>
            </div>
            <button
              onClick={() => setShowBonusForm(!showBonusForm)}
              style={{ ...styles.editBtn, padding: "2px 8px" }}
              className="btn-hover"
            >
              <Plus size={10} />
            </button>
          </div>

          {showBonusForm && (
            <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
              <input
                value={bonusDesc}
                onChange={(e) => setBonusDesc(e.target.value)}
                placeholder="Descripción"
                style={{ ...styles.input, padding: "6px 10px", fontSize: 12, flex: 1, minWidth: 100 }}
              />
              <input
                type="number"
                value={bonusAmount}
                onChange={(e) => setBonusAmount(e.target.value)}
                placeholder="$0"
                style={{ ...styles.input, padding: "6px 10px", fontSize: 12, width: 80 }}
                onKeyDown={(e) => { if (e.key === "Enter") handleAddBonus(); }}
              />
              <button onClick={handleAddBonus} style={styles.smallBtn} className="btn-hover">+</button>
            </div>
          )}

          {bonuses.length === 0 && !showBonusForm ? (
            <span style={{ fontSize: 12, color: "#555" }}>Sin bonos este mes</span>
          ) : (
            bonuses.map((b) => (
              <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 0" }}>
                <span style={{ fontSize: 12, color: "#aaa" }}>{b.description}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: "Space Mono", fontSize: 12, color: "#E8D07C" }}>{fmt(Number(b.amount))}</span>
                  <button onClick={() => onDeleteBonus(b.id)} style={{ ...styles.actionBtn, padding: 2 }}>
                    <Trash2 size={10} color="#666" />
                  </button>
                </div>
              </div>
            ))
          )}
          {totalBonuses > 0 && (
            <div style={{ borderTop: "1px solid #222", marginTop: 6, paddingTop: 4 }}>
              <span style={{ fontFamily: "Space Mono", fontSize: 13, color: "#E8D07C", fontWeight: 700 }}>Total bonos: {fmt(totalBonuses)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Totales */}
      <div style={{ borderTop: "1px solid #1E1E22", paddingTop: 12, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <span style={styles.incomeLabel}>Ingreso total</span>
          <span style={{ ...styles.incomeValue, fontSize: 22, color: "#fff" }} className="r-income-value">{fmt(totalIncome)}</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={styles.incomeLabel}>Disponible</span>
          <span style={{ ...styles.incomeValue, fontSize: 22, color: remaining >= 0 ? "#4A9B7F" : "#C44A4A" }} className="r-income-value">
            {fmt(remaining)}
          </span>
        </div>
      </div>
    </div>
  );
}
