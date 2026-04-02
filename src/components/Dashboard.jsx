import { TrendingDown, Target, TrendingUp, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";
import { fmt } from "../lib/format";
import styles from "../styles/styles";

export default function Dashboard({
  totalExpenses, savingsGoal, savingsGoalPct, remaining,
  annualSavings, onTrack, byCategory, income, potentialSavings,
}) {
  const maxCat = byCategory.length > 0 ? byCategory[0].total : 1;

  return (
    <div style={styles.content}>
      {/* Summary Cards */}
      <div style={styles.grid3} className="r-grid3">
        <div style={styles.summaryCard} className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ ...styles.iconCircle, background: "rgba(232,146,124,.12)" }}>
              <TrendingDown size={14} color="#E8927C" />
            </div>
            <span style={styles.cardLabel}>Total Gastos</span>
          </div>
          <span style={{ ...styles.cardValue, color: "#E8927C" }} className="r-card-value">{fmt(totalExpenses)}</span>
          <span style={styles.cardSub}>{income > 0 ? `${((totalExpenses / income) * 100).toFixed(0)}% del ingreso` : "\u2014"}</span>
        </div>
        <div style={styles.summaryCard} className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ ...styles.iconCircle, background: "rgba(74,155,127,.12)" }}>
              <Target size={14} color="#4A9B7F" />
            </div>
            <span style={styles.cardLabel}>Ahorro Mensual</span>
          </div>
          <span style={{ ...styles.cardValue, color: remaining >= 0 ? "#4A9B7F" : "#C44A4A" }} className="r-card-value">{fmt(Math.max(0, remaining))}</span>
          <span style={styles.cardSub}>Meta: {fmt(savingsGoal)}</span>
        </div>
        <div style={styles.summaryCard} className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ ...styles.iconCircle, background: "rgba(124,198,232,.12)" }}>
              <TrendingUp size={14} color="#7CC6E8" />
            </div>
            <span style={styles.cardLabel}>Ahorro Anual</span>
          </div>
          <span style={{ ...styles.cardValue, color: "#7CC6E8" }} className="r-card-value">{fmt(Math.max(0, annualSavings))}</span>
          <span style={styles.cardSub}>Proyección 12 meses</span>
        </div>
      </div>

      {/* Income Distribution */}
      {income > 0 && (
        <div style={styles.progressSection} className="card">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
            <span style={styles.sectionTitle} className="r-section-title">Distribución del Ingreso</span>
            <span className="r-progress-status" style={{ fontFamily: "Space Mono", fontSize: 12, color: onTrack ? "#4A9B7F" : "#C44A4A", display: "flex", alignItems: "center", gap: 4 }}>
              {onTrack ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
              {onTrack ? "En camino" : "Revisa tus gastos"}
            </span>
          </div>
          <div style={styles.progressBar}>
            <div className="bar-fill" style={{ ...styles.progressFill, width: `${Math.min(100, (totalExpenses / income) * 100)}%`, background: "#E8927C" }} />
            <div className="bar-fill" style={{ ...styles.progressFill, width: `${Math.min(100 - (totalExpenses / income) * 100, (savingsGoal / income) * 100)}%`, background: "#4A9B7F", left: `${(totalExpenses / income) * 100}%`, position: "absolute" }} />
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 10 }} className="r-legend-row">
            <span style={{ ...styles.legend, color: "#E8927C" }}>● Gastos {((totalExpenses / income) * 100).toFixed(0)}%</span>
            <span style={{ ...styles.legend, color: "#4A9B7F" }}>● Meta ahorro {savingsGoalPct}%</span>
            <span style={{ ...styles.legend, color: "#555" }}>● Libre {Math.max(0, 100 - (totalExpenses / income) * 100 - savingsGoalPct).toFixed(0)}%</span>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      <div style={styles.section} className="card">
        <span style={styles.sectionTitle} className="r-section-title">Gastos por Categoría</span>
        {byCategory.length === 0 ? (
          <p style={styles.empty}>Agrega gastos para ver el desglose</p>
        ) : (
          byCategory.map((c) => (
            <div key={c.id} style={styles.catRow} className="r-cat-row">
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 140 }} className="r-cat-row-info">
                <div style={{ ...styles.iconCircle, background: c.color + "18", width: 30, height: 30, flexShrink: 0 }}>
                  <c.Icon size={14} color={c.color} strokeWidth={2} />
                </div>
                <span style={styles.catName}>{c.label}</span>
              </div>
              <div style={{ flex: 1, margin: "0 12px", minWidth: 60 }}>
                <div style={styles.catBar}>
                  <div className="bar-fill" style={{ ...styles.catBarFill, width: `${(c.total / maxCat) * 100}%`, background: c.color }} />
                </div>
              </div>
              <div className="r-cat-row-amounts" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ ...styles.catAmount, color: c.color }}>{fmt(c.total)}</span>
                <span style={styles.catPct}>{income > 0 ? `${((c.total / income) * 100).toFixed(1)}%` : ""}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Insight Card */}
      {potentialSavings > 0 && (
        <div style={{ ...styles.insightCard, borderColor: "#C49B4A" }} className="card r-insight-card">
          <div style={{ ...styles.iconCircle, background: "rgba(196,155,74,.12)", flexShrink: 0 }}>
            <Lightbulb size={16} color="#C49B4A" />
          </div>
          <div>
            <p style={styles.insightTitle}>Potencial de ahorro detectado</p>
            <p style={styles.insightText}>
              Podrías ahorrar hasta <strong style={{ color: "#4A9B7F" }}>{fmt(potentialSavings)}</strong>/mes eliminando gastos marcados como "eliminables" y reduciendo un 30% los "reducibles".
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
