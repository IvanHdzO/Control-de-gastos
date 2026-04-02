import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { getCurrentMonth, offsetMonth, formatMonthLabel } from "../lib/month";
import styles from "../styles/styles";

export default function Header({ month, onMonthChange }) {
  const { signOut } = useAuth();
  const isCurrentMonth = month === getCurrentMonth();

  return (
    <div style={styles.header} className="r-header">
      <div>
        <h1 style={styles.title} className="r-title">Control de Gastos</h1>
        <p style={styles.subtitle}>Visualiza, controla y ahorra</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }} className="r-header-right">
        <div style={{ display: "flex", alignItems: "center", gap: 6 }} className="r-month-selector">
          <button
            onClick={() => onMonthChange(offsetMonth(month, -1))}
            style={styles.monthArrowBtn}
            className="btn-hover"
          >
            <ChevronLeft size={14} />
          </button>
          <div style={styles.monthBadge}>{formatMonthLabel(month)}</div>
          <button
            onClick={() => !isCurrentMonth && onMonthChange(offsetMonth(month, 1))}
            style={{ ...styles.monthArrowBtn, opacity: isCurrentMonth ? 0.3 : 1, cursor: isCurrentMonth ? "default" : "pointer" }}
            className={isCurrentMonth ? "" : "btn-hover"}
          >
            <ChevronRight size={14} />
          </button>
          {!isCurrentMonth && (
            <button
              onClick={() => onMonthChange(getCurrentMonth())}
              style={styles.monthTodayBtn}
              className="btn-hover"
            >
              Hoy
            </button>
          )}
        </div>
        <button onClick={signOut} style={styles.logoutBtn} className="btn-hover">
          <LogOut size={12} />
          Salir
        </button>
      </div>
    </div>
  );
}
