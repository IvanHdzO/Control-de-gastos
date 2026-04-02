import { TrendingUp, TrendingDown } from "lucide-react";
import { formatMonthLabel } from "../lib/month";
import { fmt } from "../lib/format";
import styles from "../styles/styles";

export default function HistoryTab({ history, loading }) {
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

  const maxExpense = Math.max(...history.map((h) => h.totalExpenses), 1);

  return (
    <div style={styles.section} className="card">
      <h3 style={{ ...styles.sectionTitle, marginBottom: 16 }} className="r-section-title">Historial Mensual</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {history.map((row) => {
          const positive = row.saved >= 0;
          return (
            <div key={row.month} style={styles.historyRow} className="r-history-row">
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
                  </div>
                </div>
                <div style={styles.progressBar}>
                  <div
                    className="bar-fill"
                    style={{
                      ...styles.progressFill,
                      width: `${(row.totalExpenses / row.totalIncome) * 100}%`,
                      background: positive
                        ? "linear-gradient(90deg, #4A9B7F, #6BC4A6)"
                        : "linear-gradient(90deg, #C44A4A, #E86A6A)",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
