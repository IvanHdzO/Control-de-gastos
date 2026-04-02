import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { CATEGORIES, PRIORITY, PRIORITY_COLORS } from "../lib/constants";
import styles from "../styles/styles";

export default function ExpenseModal({ isOpen, onClose, onSave, editingExpense }) {
  const [form, setForm] = useState({
    name: "", amount: "", category: "otros", priority: "reducible", recurring: true,
  });

  useEffect(() => {
    if (editingExpense) {
      setForm({
        name: editingExpense.name,
        amount: editingExpense.amount.toString(),
        category: editingExpense.category,
        priority: editingExpense.priority,
        recurring: editingExpense.recurring,
      });
    } else {
      setForm({ name: "", amount: "", category: "otros", priority: "reducible", recurring: true });
    }
  }, [editingExpense, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!form.name || !form.amount) return;
    onSave(form);
  };

  return (
    <div className="modal-overlay" style={styles.modalOverlay} onClick={onClose}>
      <div className="modal-content r-modal" style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={styles.modalTitle}>{editingExpense ? "Editar Gasto" : "Nuevo Gasto"}</h3>
          <button onClick={onClose} style={{ ...styles.actionBtn, color: "#666" }}>
            <X size={18} />
          </button>
        </div>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Nombre / Descripción</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ej: Netflix, Renta, Gasolina..."
              style={styles.input}
              autoFocus
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Monto mensual</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              placeholder="$0.00"
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Categoría</label>
            <div style={styles.categoryGrid} className="r-cat-grid">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setForm((f) => ({ ...f, category: c.id }))}
                  style={{
                    ...styles.categoryBtn,
                    background: form.category === c.id ? c.color + "20" : "rgba(255,255,255,.03)",
                    borderColor: form.category === c.id ? c.color : "rgba(255,255,255,.08)",
                  }}
                >
                  <c.Icon size={14} color={form.category === c.id ? c.color : "#666"} strokeWidth={2} />
                  <span className="r-cat-btn-label" style={{ fontSize: 10, color: form.category === c.id ? c.color : "#888", marginTop: 2 }}>{c.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Prioridad</label>
            <div style={styles.priorityGroup}>
              {Object.entries(PRIORITY).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setForm((f) => ({ ...f, priority: k }))}
                  style={{
                    ...styles.priorityBtn,
                    background: form.priority === k ? PRIORITY_COLORS[k] : "rgba(255,255,255,.05)",
                    color: form.priority === k ? "#fff" : "#888",
                    borderColor: form.priority === k ? PRIORITY_COLORS[k] : "rgba(255,255,255,.1)",
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
            <span style={styles.priorityHint}>
              {form.priority === "essential" && "No puedes eliminar este gasto (renta, comida, luz)"}
              {form.priority === "reducible" && "Puedes reducir este gasto (comidas fuera, gasolina)"}
              {form.priority === "eliminable" && "Puedes eliminar este gasto (suscripciones, lujos)"}
            </span>
          </div>
        </div>
        <div style={styles.formActions}>
          <button onClick={onClose} style={styles.cancelBtn}>Cancelar</button>
          <button onClick={handleSave} style={styles.saveBtn} className="btn-hover">
            {editingExpense ? "Actualizar" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
}
