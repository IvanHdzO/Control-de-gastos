import { useState } from "react";
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp } from "lucide-react";
import { CATEGORIES } from "../lib/constants";
import { formatMonthLabel } from "../lib/month";
import { fmt } from "../lib/format";
import styles from "../styles/styles";

function CategoryBreakdown({ byCategory, totalExpenses }) {
  const cats = CATEGORIES
    .map((c) => ({ ...c, total: byCategory[c.id] || 0 }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  const maxCat = cats.length > 0 ? cats[0].total : 1;

  return (
    <div style={{ paddingTop: 12, borderTop: "1px solid #1E1E22", marginTop: 8 }}>
      <span style={{ fontSize: 11, color: "#666", fontFamily: "'Space Mono'", textTransform: "uppercase", letterSpacing: "1px" }}>
        Gastos por Categoría
      </span>
      {cats.map((c) => (
        <div key={c.id} style={{ display: "flex", alignItems: "center", padding: "6px 0", gap: 8 }} className="r-cat-row">
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 120 }} className="r-cat-row-info">
            <div style={{ ...styles.iconCircle, background: c.color + "18", width: 24, height: 24, flexShrink: 0 }}>
              <c.Icon size={11} color={c.color} strokeWidth={2} />
            </div>
            <span style={{ fontSize: 12, color: "#ccc" }}>{c.label}</span>
          </div>
          <div style={{ flex: 1, minWidth: 40 }}>
            <div style={{ ...styles.catBar, height: 4 }}>
              <div className="bar-fill" style={{ ...styles.catBarFill, height: 4, width: `${(c.total / maxCat) * 100}%`, background: c.color }} />
            </div>
          </div>
          <div className="r-cat-row-amounts" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontFamily: "'Space Mono'", fontSize: 12, fontWeight: 700, color: c.color, minWidth: 80, textAlign: "right" }}>{fmt(c.total)}</span>
            <span style={{ fontFamily: "'Space Mono'", fontSize: 10, color: "#555", minWidth: 40, textAlign: "right" }}>
              {totalExpenses > 0 ? `${((c.total / totalExpenses) * 100).toFixed(0)}%` : ""}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HistoryTab({ history, loading }) {
  const [expanded, setExpanded] = useState({});

  const toggle = (month) => setExpanded((prev) => ({ ...prev, [month]: !prev[month] }));

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <div style={styles.spinner} />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p style={{ fontSize: 40, marginBottom: 12 }}>📊</p>
        <p style={{ color: "#888", fontSize: 14 }}>Aún no hay datos de meses anteriores</p>
        <p style={{ color: "#555", fontSize: 12, marginTop: 6 }}>El historial se llenará conforme registres gastos cada mes</p>
      </div>
    );
  }

  return (
    <div style={styles.section} className="card">
      <h3 style={{ ...styles.sectionTitle, marginBottom: 16 }} className="r-section-title">Historial Mensual</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {history.map((row) => {
          const positive = row.saved >= 0;
          const isOpen = expanded[row.month];
          return (
            <div
              key={row.month}
              style={{ ...styles.historyRow, flexDirection: "column", alignItems: "stretch", cursor: "pointer" }}
              className="r-history-row"
              onClick={() => toggle(row.month)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }} className="r-history-row-header">
                <div style={{ minWidth: 130 }} className="r-history-label">
                  <span style={{ fontFamily: "'Space Mono'", fontSize: 13, color: "#ddd", textTransform: "capitalize" }}>
                    {formatMonthLabel(row.month)}
                  </span>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }} className="r-history-stats">
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, color: "#888" }}>
                        Ingresos: <span style={{ color: "#fff", fontFamily: "'Space Mono'", fontWeight: 700 }}>{fmt(row.totalIncome)}</span>
                      </span>
                      <span style={{ fontSize: 12, color: "#888" }}>
                        Gastos: <span style={{ color: "#C44A4A", fontFamily: "'Space Mono'", fontWeight: 700 }}>{fmt(row.totalExpenses)}</span>
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {positive ? <TrendingUp size={14} color="#4A9B7F" /> : <TrendingDown size={14} color="#C44A4A" />}
                      <span style={{ fontFamily: "'Space Mono'", fontSize: 14, fontWeight: 700, color: positive ? "#4A9B7F" : "#C44A4A" }}>
                        {fmt(Math.abs(row.saved))}
                      </span>
                      <span style={{
                        fontSize: 11, fontFamily: "'Space Mono'", padding: "2px 8px", borderRadius: 10, fontWeight: 600,
                        background: positive ? "rgba(74,155,127,.15)" : "rgba(196,74,74,.15)",
                        color: positive ? "#4A9B7F" : "#C44A4A",
                      }}>
                        {row.pct >= 0 ? "+" : ""}{row.pct.toFixed(1)}%
                      </span>
                      {isOpen ? <ChevronUp size={14} color="#666" /> : <ChevronDown size={14} color="#666" />}
                    </div>
                  </div>
                  <div style={styles.progressBar}>
                    <div
                      className="bar-fill"
                      style={{
                        ...styles.progressFill,
                        width: `${row.totalIncome > 0 ? (row.totalExpenses / row.totalIncome) * 100 : 0}%`,
                        background: positive
                          ? "linear-gradient(90deg, #4A9B7F, #6BC4A6)"
                          : "linear-gradient(90deg, #C44A4A, #E86A6A)",
                      }}
                    />
                  </div>
                </div>
              </div>
              {isOpen && row.byCategory && Object.keys(row.byCategory).length > 0 && (
                <CategoryBreakdown byCategory={row.byCategory} totalExpenses={row.totalExpenses} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
