import { Plus, Pencil, Trash2, ClipboardList } from "lucide-react";
import { CATEGORIES, PRIORITY, PRIORITY_COLORS } from "../lib/constants";
import { fmt } from "../lib/format";
import styles from "../styles/styles";

export default function ExpenseList({ expenses, onAddClick, onEdit, onDelete }) {
  return (
    <div style={styles.content}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={styles.sectionTitle}>{expenses.length} gastos registrados</span>
        <button onClick={onAddClick} style={styles.addBtn} className="btn-hover">
          <Plus size={14} style={{ marginRight: 6 }} />
          Agregar Gasto
        </button>
      </div>

      {expenses.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{ ...styles.iconCircle, width: 56, height: 56, background: "rgba(255,255,255,.04)", margin: "0 auto 16px" }}>
            <ClipboardList size={24} color="#555" />
          </div>
          <p style={{ color: "#888", fontSize: 15 }}>Aún no tienes gastos registrados</p>
          <p style={{ color: "#555", fontSize: 13, marginTop: 4 }}>Haz clic en "Agregar Gasto" para comenzar</p>
        </div>
      ) : (
        <div style={styles.expenseList}>
          {CATEGORIES.map((cat) => {
            const items = expenses.filter((e) => e.category === cat.id);
            if (items.length === 0) return null;
            const catTotal = items.reduce((s, e) => s + Number(e.amount), 0);
            return (
              <div key={cat.id} style={{ marginBottom: 4 }}>
                <div style={styles.catHeader}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <cat.Icon size={14} color={cat.color} strokeWidth={2} />
                    <span>{cat.label}</span>
                  </div>
                  <span style={{ fontFamily: "Space Mono", color: cat.color }}>{fmt(catTotal)}</span>
                </div>
                {items.map((exp) => (
                  <div key={exp.id} className="expense-row" style={styles.expenseRow}>
                    <div style={{ flex: 1 }}>
                      <span style={styles.expName}>{exp.name}</span>
                      <span style={{ ...styles.priorityTag, background: PRIORITY_COLORS[exp.priority] + "22", color: PRIORITY_COLORS[exp.priority] }}>
                        {PRIORITY[exp.priority]}
                      </span>
                    </div>
                    <span style={styles.expAmount}>{fmt(Number(exp.amount))}</span>
                    <button onClick={() => onEdit(exp)} style={styles.actionBtn} title="Editar"><Pencil size={13} /></button>
                    <button onClick={() => onDelete(exp.id)} className="delete-btn" style={{ ...styles.actionBtn, color: "#C44A4A" }} title="Eliminar"><Trash2 size={13} /></button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
