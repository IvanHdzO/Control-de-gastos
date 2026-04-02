import { Target, Lightbulb, CheckCircle, AlertTriangle, RotateCcw } from "lucide-react";
import { CATEGORIES } from "../lib/constants";
import { fmt } from "../lib/format";
import styles from "../styles/styles";

export default function SavingsTab({
  savingsGoalPct, onSavingsGoalChange, savingsGoal, income,
  remaining, onTrack, eliminable, reducible, potentialSavings, onReset,
}) {
  return (
    <div style={styles.content}>
      <div style={styles.section} className="card">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Target size={16} color="#4A9B7F" />
          <span style={styles.sectionTitle} className="r-section-title">Meta de Ahorro</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 12 }}>
          <input
            type="range"
            min={5}
            max={50}
            value={savingsGoalPct}
            onChange={(e) => onSavingsGoalChange(parseInt(e.target.value))}
            style={{ flex: 1, accentColor: "#4A9B7F" }}
          />
          <span style={{ fontFamily: "Space Mono", fontSize: 28, color: "#4A9B7F", minWidth: 70 }}>{savingsGoalPct}%</span>
        </div>
        <div style={styles.grid2} className="r-grid2">
          <div style={{ ...styles.miniCard, borderColor: "#4A9B7F" }}>
            <span style={styles.miniLabel}>Meta mensual</span>
            <span style={{ ...styles.miniValue, color: "#4A9B7F" }} className="r-mini-value">{fmt(savingsGoal)}</span>
          </div>
          <div style={{ ...styles.miniCard, borderColor: "#7CC6E8" }}>
            <span style={styles.miniLabel}>Meta anual</span>
            <span style={{ ...styles.miniValue, color: "#7CC6E8" }} className="r-mini-value">{fmt(savingsGoal * 12)}</span>
          </div>
        </div>
        {income > 0 && (
          <div style={{ marginTop: 16, padding: 16, background: onTrack ? "rgba(74,155,127,.08)" : "rgba(196,74,74,.08)", borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
            {onTrack ? <CheckCircle size={16} color="#4A9B7F" /> : <AlertTriangle size={16} color="#C44A4A" />}
            <p style={{ fontFamily: "DM Sans", fontSize: 14, color: onTrack ? "#4A9B7F" : "#C44A4A", margin: 0 }}>
              {onTrack
                ? `Estás ahorrando ${fmt(remaining)} al mes — ${fmt(remaining - savingsGoal)} por encima de tu meta.`
                : `Te faltan ${fmt(savingsGoal - remaining)} para alcanzar tu meta mensual.`}
            </p>
          </div>
        )}
      </div>

      <div style={styles.section} className="card">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Lightbulb size={16} color="#C49B4A" />
          <span style={styles.sectionTitle} className="r-section-title">Oportunidades de Ahorro</span>
        </div>
        {eliminable.length === 0 && reducible.length === 0 ? (
          <p style={styles.empty}>Marca gastos como "Eliminable" o "Reducible" para ver recomendaciones</p>
        ) : (
          <>
            {eliminable.length > 0 && (
              <div style={{ marginBottom: 16, marginTop: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ ...styles.dot, background: "#C44A4A" }} />
                  <span style={styles.oppTitle}>Gastos eliminables — {fmt(eliminable.reduce((s, e) => s + Number(e.amount), 0))}/mes</span>
                </div>
                {eliminable.map((e) => {
                  const cat = CATEGORIES.find((c) => c.id === e.category);
                  return (
                    <div key={e.id} style={styles.oppRow} className="r-opp-row">
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {cat && <cat.Icon size={13} color={cat.color} strokeWidth={2} />}
                        <span>{e.name}</span>
                      </div>
                      <span style={{ fontFamily: "Space Mono", color: "#C44A4A" }}>- {fmt(Number(e.amount))}</span>
                    </div>
                  );
                })}
              </div>
            )}
            {reducible.length > 0 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                  <span style={{ ...styles.dot, background: "#C49B4A" }} />
                  <span style={styles.oppTitle}>Gastos reducibles — ahorro estimado {fmt(reducible.reduce((s, e) => s + Number(e.amount) * 0.3, 0))}/mes</span>
                </div>
                {reducible.map((e) => {
                  const cat = CATEGORIES.find((c) => c.id === e.category);
                  return (
                    <div key={e.id} style={styles.oppRow} className="r-opp-row">
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {cat && <cat.Icon size={13} color={cat.color} strokeWidth={2} />}
                        <span>{e.name} ({fmt(Number(e.amount))})</span>
                      </div>
                      <span style={{ fontFamily: "Space Mono", color: "#C49B4A" }}>~ - {fmt(Number(e.amount) * 0.3)}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ marginTop: 20, padding: 16, background: "rgba(74,155,127,.06)", borderRadius: 10, borderLeft: "3px solid #4A9B7F" }}>
              <p style={{ fontFamily: "DM Sans", fontSize: 14, color: "#ccc", lineHeight: 1.6, margin: 0 }}>
                <strong style={{ color: "#4A9B7F" }}>Si eliminas y reduces estos gastos:</strong><br />
                Ahorro mensual adicional: <strong style={{ color: "#fff" }}>{fmt(potentialSavings)}</strong><br />
                Ahorro anual adicional: <strong style={{ color: "#fff" }}>{fmt(potentialSavings * 12)}</strong>
              </p>
            </div>
          </>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <button
          onClick={() => {
            if (confirm("¿Borrar todos los datos y empezar de nuevo?")) {
              onReset();
            }
          }}
          style={styles.resetBtn}
        >
          <RotateCcw size={12} style={{ marginRight: 6 }} />
          Reiniciar todo
        </button>
      </div>
    </div>
  );
}
