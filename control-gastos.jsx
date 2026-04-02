import { useState, useEffect, useRef } from "react";
import {
  Home, ShoppingCart, Car, Zap, Film, Heart, BookOpen, Smartphone,
  Shirt, CreditCard, Package, Plus, Pencil, X, Lightbulb, Target,
  LayoutDashboard, List, PiggyBank, Trash2, ClipboardList, TrendingUp,
  TrendingDown, AlertTriangle, CheckCircle, RotateCcw
} from "lucide-react";

const CATEGORIES = [
  { id: "vivienda", label: "Vivienda", Icon: Home, color: "#E8927C" },
  { id: "alimentacion", label: "Alimentación", Icon: ShoppingCart, color: "#7CC6E8" },
  { id: "transporte", label: "Transporte", Icon: Car, color: "#E8D07C" },
  { id: "servicios", label: "Servicios", Icon: Zap, color: "#A57CE8" },
  { id: "entretenimiento", label: "Entretenimiento", Icon: Film, color: "#E87CA5" },
  { id: "salud", label: "Salud", Icon: Heart, color: "#7CE8B8" },
  { id: "educacion", label: "Educación", Icon: BookOpen, color: "#7C8AE8" },
  { id: "suscripciones", label: "Suscripciones", Icon: Smartphone, color: "#E8A57C" },
  { id: "ropa", label: "Ropa", Icon: Shirt, color: "#C47CE8" },
  { id: "deudas", label: "Deudas/Créditos", Icon: CreditCard, color: "#E87C7C" },
  { id: "otros", label: "Otros", Icon: Package, color: "#8BE87C" },
];

const PRIORITY = { essential: "Esencial", reducible: "Reducible", eliminable: "Eliminable" };
const PRIORITY_COLORS = { essential: "#4A9B7F", reducible: "#C49B4A", eliminable: "#C44A4A" };

const fmt = (n) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);

const initialState = {
  income: 0,
  savingsGoalPct: 20,
  expenses: [],
  editingIncome: false,
  showAddExpense: false,
  editingExpense: null,
  activeTab: "dashboard",
};

export default function App() {
  const [state, setState] = useState(initialState);
  const [loaded, setLoaded] = useState(false);
  const [newExpense, setNewExpense] = useState({ name: "", amount: "", category: "otros", priority: "reducible", recurring: true });
  const inputRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("expense-tracker-data");
        if (res?.value) setState((s) => ({ ...s, ...JSON.parse(res.value) }));
      } catch {}
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const { editingIncome, showAddExpense, editingExpense, activeTab, ...data } = state;
    try { window.storage.set("expense-tracker-data", JSON.stringify(data)); } catch {}
  }, [state.income, state.savingsGoalPct, state.expenses, loaded]);

  const totalExpenses = state.expenses.reduce((s, e) => s + e.amount, 0);
  const savingsGoal = state.income * (state.savingsGoalPct / 100);
  const remaining = state.income - totalExpenses;
  const annualSavings = remaining * 12;
  const onTrack = remaining >= savingsGoal;

  const byCategory = CATEGORIES.map((c) => {
    const items = state.expenses.filter((e) => e.category === c.id);
    const total = items.reduce((s, e) => s + e.amount, 0);
    return { ...c, items, total };
  }).filter((c) => c.total > 0).sort((a, b) => b.total - a.total);

  const eliminable = state.expenses.filter((e) => e.priority === "eliminable");
  const reducible = state.expenses.filter((e) => e.priority === "reducible");
  const potentialSavings = eliminable.reduce((s, e) => s + e.amount, 0) + reducible.reduce((s, e) => s + e.amount * 0.3, 0);

  const addExpense = () => {
    if (!newExpense.name || !newExpense.amount) return;
    const expense = { ...newExpense, amount: parseFloat(newExpense.amount), id: Date.now().toString() };
    setState((s) => ({ ...s, expenses: [...s.expenses, expense], showAddExpense: false }));
    setNewExpense({ name: "", amount: "", category: "otros", priority: "reducible", recurring: true });
  };

  const updateExpense = () => {
    if (!newExpense.name || !newExpense.amount) return;
    setState((s) => ({
      ...s,
      expenses: s.expenses.map((e) => e.id === s.editingExpense ? { ...newExpense, amount: parseFloat(newExpense.amount), id: e.id } : e),
      editingExpense: null,
      showAddExpense: false,
    }));
    setNewExpense({ name: "", amount: "", category: "otros", priority: "reducible", recurring: true });
  };

  const deleteExpense = (id) => setState((s) => ({ ...s, expenses: s.expenses.filter((e) => e.id !== id) }));

  const startEdit = (exp) => {
    setNewExpense({ name: exp.name, amount: exp.amount.toString(), category: exp.category, priority: exp.priority, recurring: exp.recurring });
    setState((s) => ({ ...s, editingExpense: exp.id, showAddExpense: true, activeTab: "gastos" }));
  };

  const maxCat = byCategory.length > 0 ? byCategory[0].total : 1;

  if (!loaded) return <div style={styles.loading}><div style={styles.spinner} /></div>;

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus, select:focus, button:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .6; } }
        @keyframes slideUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
        .card { animation: fadeIn .4s ease both; }
        .card:nth-child(2) { animation-delay: .05s; }
        .card:nth-child(3) { animation-delay: .1s; }
        .card:nth-child(4) { animation-delay: .15s; }
        .bar-fill { transition: width .8s cubic-bezier(.4,0,.2,1); }
        .btn-hover:hover { filter: brightness(1.15); transform: translateY(-1px); }
        .tab-btn { transition: all .2s ease; }
        .tab-btn:hover { background: rgba(255,255,255,.06); }
        .expense-row:hover { background: rgba(255,255,255,.03); }
        .delete-btn { opacity: 0; transition: opacity .2s; }
        .expense-row:hover .delete-btn { opacity: 1; }
        .modal-overlay { animation: fadeIn .2s ease; }
        .modal-content { animation: slideUp .3s ease; }
      `}</style>

      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Control de Gastos</h1>
          <p style={styles.subtitle}>Visualiza, controla y ahorra</p>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.monthBadge}>
            {new Date().toLocaleDateString("es-MX", { month: "long", year: "numeric" })}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={styles.tabs}>
        {[
          { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
          { id: "gastos", label: "Mis Gastos", Icon: List },
          { id: "ahorro", label: "Ahorro", Icon: PiggyBank },
        ].map((t) => (
          <button
            key={t.id}
            className="tab-btn"
            onClick={() => setState((s) => ({ ...s, activeTab: t.id }))}
            style={{ ...styles.tab, ...(state.activeTab === t.id ? styles.tabActive : {}) }}
          >
            <t.Icon size={14} style={{ marginRight: 6, opacity: state.activeTab === t.id ? 1 : 0.5 }} />
            {t.label}
          </button>
        ))}
      </div>

      {/* INCOME BAR */}
      <div style={styles.incomeBar} className="card">
        <div style={styles.incomeLeft}>
          <span style={styles.incomeLabel}>Ingreso mensual</span>
          {state.editingIncome ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ color: "#666", fontFamily: "Space Mono" }}>$</span>
              <input
                ref={inputRef}
                type="number"
                defaultValue={state.income || ""}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setState((s) => ({ ...s, income: parseFloat(e.target.value) || 0, editingIncome: false }));
                  }
                }}
                style={styles.incomeInput}
                autoFocus
              />
              <button
                onClick={() => {
                  const v = inputRef.current?.value;
                  setState((s) => ({ ...s, income: parseFloat(v) || 0, editingIncome: false }));
                }}
                style={styles.smallBtn}
                className="btn-hover"
              >
                Guardar
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={styles.incomeValue}>{fmt(state.income)}</span>
              <button onClick={() => setState((s) => ({ ...s, editingIncome: true }))} style={styles.editBtn} className="btn-hover">
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

      {/* DASHBOARD TAB */}
      {state.activeTab === "dashboard" && (
        <div style={styles.content}>
          <div style={styles.grid3}>
            <div style={styles.summaryCard} className="card">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ ...styles.iconCircle, background: "rgba(232,146,124,.12)" }}>
                  <TrendingDown size={14} color="#E8927C" />
                </div>
                <span style={styles.cardLabel}>Total Gastos</span>
              </div>
              <span style={{ ...styles.cardValue, color: "#E8927C" }}>{fmt(totalExpenses)}</span>
              <span style={styles.cardSub}>{state.income > 0 ? `${((totalExpenses / state.income) * 100).toFixed(0)}% del ingreso` : "—"}</span>
            </div>
            <div style={styles.summaryCard} className="card">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ ...styles.iconCircle, background: "rgba(74,155,127,.12)" }}>
                  <Target size={14} color="#4A9B7F" />
                </div>
                <span style={styles.cardLabel}>Ahorro Mensual</span>
              </div>
              <span style={{ ...styles.cardValue, color: remaining >= 0 ? "#4A9B7F" : "#C44A4A" }}>{fmt(Math.max(0, remaining))}</span>
              <span style={styles.cardSub}>Meta: {fmt(savingsGoal)}</span>
            </div>
            <div style={styles.summaryCard} className="card">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ ...styles.iconCircle, background: "rgba(124,198,232,.12)" }}>
                  <TrendingUp size={14} color="#7CC6E8" />
                </div>
                <span style={styles.cardLabel}>Ahorro Anual</span>
              </div>
              <span style={{ ...styles.cardValue, color: "#7CC6E8" }}>{fmt(Math.max(0, annualSavings))}</span>
              <span style={styles.cardSub}>Proyección 12 meses</span>
            </div>
          </div>

          {state.income > 0 && (
            <div style={styles.progressSection} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={styles.sectionTitle}>Distribución del Ingreso</span>
                <span style={{ fontFamily: "Space Mono", fontSize: 12, color: onTrack ? "#4A9B7F" : "#C44A4A", display: "flex", alignItems: "center", gap: 4 }}>
                  {onTrack ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                  {onTrack ? "En camino" : "Revisa tus gastos"}
                </span>
              </div>
              <div style={styles.progressBar}>
                <div className="bar-fill" style={{ ...styles.progressFill, width: `${Math.min(100, (totalExpenses / state.income) * 100)}%`, background: "#E8927C" }} />
                <div className="bar-fill" style={{ ...styles.progressFill, width: `${Math.min(100 - (totalExpenses / state.income) * 100, (savingsGoal / state.income) * 100)}%`, background: "#4A9B7F", left: `${(totalExpenses / state.income) * 100}%`, position: "absolute" }} />
              </div>
              <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
                <span style={{ ...styles.legend, color: "#E8927C" }}>● Gastos {((totalExpenses / state.income) * 100).toFixed(0)}%</span>
                <span style={{ ...styles.legend, color: "#4A9B7F" }}>● Meta ahorro {state.savingsGoalPct}%</span>
                <span style={{ ...styles.legend, color: "#555" }}>● Libre {Math.max(0, 100 - (totalExpenses / state.income) * 100 - state.savingsGoalPct).toFixed(0)}%</span>
              </div>
            </div>
          )}

          <div style={styles.section} className="card">
            <span style={styles.sectionTitle}>Gastos por Categoría</span>
            {byCategory.length === 0 ? (
              <p style={styles.empty}>Agrega gastos para ver el desglose</p>
            ) : (
              byCategory.map((c) => (
                <div key={c.id} style={styles.catRow}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 160 }}>
                    <div style={{ ...styles.iconCircle, background: c.color + "18", width: 30, height: 30 }}>
                      <c.Icon size={14} color={c.color} strokeWidth={2} />
                    </div>
                    <span style={styles.catName}>{c.label}</span>
                  </div>
                  <div style={{ flex: 1, margin: "0 16px" }}>
                    <div style={styles.catBar}>
                      <div className="bar-fill" style={{ ...styles.catBarFill, width: `${(c.total / maxCat) * 100}%`, background: c.color }} />
                    </div>
                  </div>
                  <span style={{ ...styles.catAmount, color: c.color }}>{fmt(c.total)}</span>
                  <span style={styles.catPct}>{state.income > 0 ? `${((c.total / state.income) * 100).toFixed(1)}%` : ""}</span>
                </div>
              ))
            )}
          </div>

          {potentialSavings > 0 && (
            <div style={{ ...styles.insightCard, borderColor: "#C49B4A" }} className="card">
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
      )}

      {/* GASTOS TAB */}
      {state.activeTab === "gastos" && (
        <div style={styles.content}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={styles.sectionTitle}>{state.expenses.length} gastos registrados</span>
            <button
              onClick={() => { setState((s) => ({ ...s, showAddExpense: true, editingExpense: null })); setNewExpense({ name: "", amount: "", category: "otros", priority: "reducible", recurring: true }); }}
              style={styles.addBtn}
              className="btn-hover"
            >
              <Plus size={14} style={{ marginRight: 6 }} />
              Agregar Gasto
            </button>
          </div>

          {state.showAddExpense && (
            <div className="modal-overlay" style={styles.modalOverlay} onClick={() => setState((s) => ({ ...s, showAddExpense: false, editingExpense: null }))}>
              <div className="modal-content" style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h3 style={styles.modalTitle}>{state.editingExpense ? "Editar Gasto" : "Nuevo Gasto"}</h3>
                  <button onClick={() => setState((s) => ({ ...s, showAddExpense: false, editingExpense: null }))} style={{ ...styles.actionBtn, color: "#666" }}>
                    <X size={18} />
                  </button>
                </div>
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Nombre / Descripción</label>
                    <input value={newExpense.name} onChange={(e) => setNewExpense((n) => ({ ...n, name: e.target.value }))} placeholder="Ej: Netflix, Renta, Gasolina..." style={styles.input} autoFocus />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Monto mensual</label>
                    <input type="number" value={newExpense.amount} onChange={(e) => setNewExpense((n) => ({ ...n, amount: e.target.value }))} placeholder="$0.00" style={styles.input} />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Categoría</label>
                    <div style={styles.categoryGrid}>
                      {CATEGORIES.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setNewExpense((n) => ({ ...n, category: c.id }))}
                          style={{
                            ...styles.categoryBtn,
                            background: newExpense.category === c.id ? c.color + "20" : "rgba(255,255,255,.03)",
                            borderColor: newExpense.category === c.id ? c.color : "rgba(255,255,255,.08)",
                          }}
                        >
                          <c.Icon size={14} color={newExpense.category === c.id ? c.color : "#666"} strokeWidth={2} />
                          <span style={{ fontSize: 10, color: newExpense.category === c.id ? c.color : "#888", marginTop: 2 }}>{c.label}</span>
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
                          onClick={() => setNewExpense((n) => ({ ...n, priority: k }))}
                          style={{
                            ...styles.priorityBtn,
                            background: newExpense.priority === k ? PRIORITY_COLORS[k] : "rgba(255,255,255,.05)",
                            color: newExpense.priority === k ? "#fff" : "#888",
                            borderColor: newExpense.priority === k ? PRIORITY_COLORS[k] : "rgba(255,255,255,.1)",
                          }}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                    <span style={styles.priorityHint}>
                      {newExpense.priority === "essential" && "No puedes eliminar este gasto (renta, comida, luz)"}
                      {newExpense.priority === "reducible" && "Puedes reducir este gasto (comidas fuera, gasolina)"}
                      {newExpense.priority === "eliminable" && "Puedes eliminar este gasto (suscripciones, lujos)"}
                    </span>
                  </div>
                </div>
                <div style={styles.formActions}>
                  <button onClick={() => setState((s) => ({ ...s, showAddExpense: false, editingExpense: null }))} style={styles.cancelBtn}>Cancelar</button>
                  <button onClick={state.editingExpense ? updateExpense : addExpense} style={styles.saveBtn} className="btn-hover">
                    {state.editingExpense ? "Actualizar" : "Agregar"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {state.expenses.length === 0 ? (
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
                const items = state.expenses.filter((e) => e.category === cat.id);
                if (items.length === 0) return null;
                const catTotal = items.reduce((s, e) => s + e.amount, 0);
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
                        <span style={styles.expAmount}>{fmt(exp.amount)}</span>
                        <button onClick={() => startEdit(exp)} style={styles.actionBtn} title="Editar"><Pencil size={13} /></button>
                        <button onClick={() => deleteExpense(exp.id)} className="delete-btn" style={{ ...styles.actionBtn, color: "#C44A4A" }} title="Eliminar"><Trash2 size={13} /></button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* AHORRO TAB */}
      {state.activeTab === "ahorro" && (
        <div style={styles.content}>
          <div style={styles.section} className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <Target size={16} color="#4A9B7F" />
              <span style={styles.sectionTitle}>Meta de Ahorro</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 12 }}>
              <input type="range" min={5} max={50} value={state.savingsGoalPct} onChange={(e) => setState((s) => ({ ...s, savingsGoalPct: parseInt(e.target.value) }))} style={{ flex: 1, accentColor: "#4A9B7F" }} />
              <span style={{ fontFamily: "Space Mono", fontSize: 28, color: "#4A9B7F", minWidth: 70 }}>{state.savingsGoalPct}%</span>
            </div>
            <div style={styles.grid2}>
              <div style={{ ...styles.miniCard, borderColor: "#4A9B7F" }}>
                <span style={styles.miniLabel}>Meta mensual</span>
                <span style={{ ...styles.miniValue, color: "#4A9B7F" }}>{fmt(savingsGoal)}</span>
              </div>
              <div style={{ ...styles.miniCard, borderColor: "#7CC6E8" }}>
                <span style={styles.miniLabel}>Meta anual</span>
                <span style={{ ...styles.miniValue, color: "#7CC6E8" }}>{fmt(savingsGoal * 12)}</span>
              </div>
            </div>
            {state.income > 0 && (
              <div style={{ marginTop: 16, padding: 16, background: onTrack ? "rgba(74,155,127,.08)" : "rgba(196,74,74,.08)", borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
                {onTrack ? <CheckCircle size={16} color="#4A9B7F" /> : <AlertTriangle size={16} color="#C44A4A" />}
                <p style={{ fontFamily: "DM Sans", fontSize: 14, color: onTrack ? "#4A9B7F" : "#C44A4A" }}>
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
              <span style={styles.sectionTitle}>Oportunidades de Ahorro</span>
            </div>
            {eliminable.length === 0 && reducible.length === 0 ? (
              <p style={styles.empty}>Marca gastos como "Eliminable" o "Reducible" para ver recomendaciones</p>
            ) : (
              <>
                {eliminable.length > 0 && (
                  <div style={{ marginBottom: 16, marginTop: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <span style={{ ...styles.dot, background: "#C44A4A" }} />
                      <span style={styles.oppTitle}>Gastos eliminables — {fmt(eliminable.reduce((s, e) => s + e.amount, 0))}/mes</span>
                    </div>
                    {eliminable.map((e) => {
                      const cat = CATEGORIES.find((c) => c.id === e.category);
                      return (
                        <div key={e.id} style={styles.oppRow}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {cat && <cat.Icon size={13} color={cat.color} strokeWidth={2} />}
                            <span>{e.name}</span>
                          </div>
                          <span style={{ fontFamily: "Space Mono", color: "#C44A4A" }}>- {fmt(e.amount)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {reducible.length > 0 && (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <span style={{ ...styles.dot, background: "#C49B4A" }} />
                      <span style={styles.oppTitle}>Gastos reducibles — ahorro estimado {fmt(reducible.reduce((s, e) => s + e.amount * 0.3, 0))}/mes</span>
                    </div>
                    {reducible.map((e) => {
                      const cat = CATEGORIES.find((c) => c.id === e.category);
                      return (
                        <div key={e.id} style={styles.oppRow}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {cat && <cat.Icon size={13} color={cat.color} strokeWidth={2} />}
                            <span>{e.name} ({fmt(e.amount)})</span>
                          </div>
                          <span style={{ fontFamily: "Space Mono", color: "#C49B4A" }}>~ - {fmt(e.amount * 0.3)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div style={{ marginTop: 20, padding: 16, background: "rgba(74,155,127,.06)", borderRadius: 10, borderLeft: "3px solid #4A9B7F" }}>
                  <p style={{ fontFamily: "DM Sans", fontSize: 14, color: "#ccc", lineHeight: 1.6 }}>
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
              onClick={async () => {
                if (confirm("¿Borrar todos los datos y empezar de nuevo?")) {
                  try { await window.storage.delete("expense-tracker-data"); } catch {}
                  setState({ ...initialState, activeTab: "dashboard" });
                }
              }}
              style={styles.resetBtn}
            >
              <RotateCcw size={12} style={{ marginRight: 6 }} />
              Reiniciar todo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  root: { fontFamily: "'DM Sans', sans-serif", background: "#0D0D0F", color: "#E8E8E8", minHeight: "100vh", padding: "20px 20px 40px" },
  loading: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#0D0D0F" },
  spinner: { width: 32, height: 32, border: "2px solid #222", borderTop: "2px solid #4A9B7F", borderRadius: "50%", animation: "pulse 1s infinite" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  title: { fontFamily: "'Space Mono', monospace", fontSize: 26, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" },
  subtitle: { fontSize: 13, color: "#666", marginTop: 4, letterSpacing: "0.5px" },
  headerRight: { textAlign: "right" },
  monthBadge: { fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#888", padding: "6px 12px", border: "1px solid #222", borderRadius: 20, textTransform: "capitalize" },
  tabs: { display: "flex", gap: 4, marginBottom: 20, background: "rgba(255,255,255,.03)", borderRadius: 10, padding: 4 },
  tab: { flex: 1, padding: "10px 16px", border: "none", background: "transparent", color: "#666", fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 500, borderRadius: 8, cursor: "pointer", transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center" },
  tabActive: { background: "rgba(255,255,255,.08)", color: "#fff" },
  incomeBar: { display: "flex", alignItems: "center", background: "#131316", border: "1px solid #1E1E22", borderRadius: 14, padding: "16px 24px", marginBottom: 20, gap: 24 },
  incomeLeft: { flex: 1 },
  incomeRight: { textAlign: "right" },
  incomeDivider: { width: 1, height: 40, background: "#222" },
  incomeLabel: { display: "block", fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'Space Mono'", marginBottom: 6 },
  incomeValue: { fontFamily: "'Space Mono', monospace", fontSize: 22, fontWeight: 700, color: "#fff" },
  incomeInput: { fontFamily: "'Space Mono'", fontSize: 20, background: "transparent", border: "none", borderBottom: "2px solid #4A9B7F", color: "#fff", width: 160, padding: "4px 0" },
  editBtn: { padding: "4px 12px", background: "rgba(255,255,255,.06)", border: "1px solid #333", borderRadius: 6, color: "#888", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans'", display: "flex", alignItems: "center" },
  smallBtn: { padding: "6px 14px", background: "#4A9B7F", border: "none", borderRadius: 6, color: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans'", fontWeight: 500 },
  content: {},
  grid3: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 },
  grid2: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginTop: 16 },
  summaryCard: { background: "#131316", border: "1px solid #1E1E22", borderRadius: 14, padding: 20 },
  iconCircle: { width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
  cardLabel: { fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'Space Mono'" },
  cardValue: { display: "block", fontFamily: "'Space Mono', monospace", fontSize: 20, fontWeight: 700 },
  cardSub: { display: "block", fontSize: 12, color: "#555", marginTop: 6, fontFamily: "'DM Sans'" },
  progressSection: { background: "#131316", border: "1px solid #1E1E22", borderRadius: 14, padding: 20, marginBottom: 20 },
  progressBar: { height: 12, background: "#1A1A1E", borderRadius: 6, overflow: "hidden", position: "relative" },
  progressFill: { height: "100%", borderRadius: 6 },
  legend: { fontSize: 11, fontFamily: "'Space Mono'" },
  section: { background: "#131316", border: "1px solid #1E1E22", borderRadius: 14, padding: 20, marginBottom: 20 },
  sectionTitle: { fontFamily: "'Space Mono', monospace", fontSize: 14, fontWeight: 700, color: "#ddd" },
  catRow: { display: "flex", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1A1A1E" },
  catName: { fontSize: 13, color: "#ccc" },
  catBar: { height: 6, background: "#1A1A1E", borderRadius: 3, overflow: "hidden" },
  catBarFill: { height: "100%", borderRadius: 3 },
  catAmount: { fontFamily: "'Space Mono'", fontSize: 13, fontWeight: 700, minWidth: 100, textAlign: "right" },
  catPct: { fontFamily: "'Space Mono'", fontSize: 11, color: "#555", minWidth: 50, textAlign: "right" },
  empty: { color: "#555", fontSize: 13, padding: "20px 0", textAlign: "center" },
  addBtn: { padding: "10px 20px", background: "#4A9B7F", border: "none", borderRadius: 8, color: "#fff", fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center" },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, backdropFilter: "blur(4px)" },
  modal: { background: "#18181C", border: "1px solid #2A2A30", borderRadius: 16, padding: 28, width: "100%", maxWidth: 480, maxHeight: "90vh", overflow: "auto" },
  modalTitle: { fontFamily: "'Space Mono'", fontSize: 18, fontWeight: 700, color: "#fff" },
  formGrid: { display: "flex", flexDirection: "column", gap: 16 },
  formGroup: {},
  formLabel: { display: "block", fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'Space Mono'", marginBottom: 6 },
  input: { width: "100%", padding: "10px 14px", background: "#0D0D0F", border: "1px solid #2A2A30", borderRadius: 8, color: "#fff", fontFamily: "'DM Sans'", fontSize: 14 },
  categoryGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 },
  categoryBtn: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "8px 4px", border: "1px solid", borderRadius: 8, background: "transparent", cursor: "pointer", transition: "all .2s" },
  priorityGroup: { display: "flex", gap: 8 },
  priorityBtn: { flex: 1, padding: "8px 12px", border: "1px solid", borderRadius: 8, fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .2s" },
  priorityHint: { display: "block", fontSize: 11, color: "#666", marginTop: 6, fontStyle: "italic" },
  formActions: { display: "flex", gap: 12, marginTop: 20, justifyContent: "flex-end" },
  cancelBtn: { padding: "10px 20px", background: "transparent", border: "1px solid #333", borderRadius: 8, color: "#888", fontFamily: "'DM Sans'", fontSize: 13, cursor: "pointer" },
  saveBtn: { padding: "10px 24px", background: "#4A9B7F", border: "none", borderRadius: 8, color: "#fff", fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  expenseList: {},
  catHeader: { display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "rgba(255,255,255,.02)", borderRadius: 8, marginBottom: 2, fontSize: 13, fontWeight: 600, color: "#aaa" },
  expenseRow: { display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 6, transition: "background .15s", cursor: "default" },
  expName: { fontSize: 14, color: "#ddd", marginRight: 8 },
  expAmount: { fontFamily: "'Space Mono'", fontSize: 13, fontWeight: 700, color: "#fff", minWidth: 90, textAlign: "right" },
  priorityTag: { fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 600, letterSpacing: "0.3px" },
  actionBtn: { background: "none", border: "none", color: "#666", fontSize: 14, cursor: "pointer", padding: "4px 6px", borderRadius: 4, display: "flex", alignItems: "center" },
  insightCard: { display: "flex", gap: 16, alignItems: "flex-start", padding: 20, background: "#131316", border: "1px solid #1E1E22", borderLeft: "3px solid", borderRadius: 14, marginBottom: 20 },
  insightTitle: { fontFamily: "'Space Mono'", fontSize: 13, fontWeight: 700, color: "#ddd", marginBottom: 4 },
  insightText: { fontSize: 13, color: "#999", lineHeight: 1.6 },
  emptyState: { textAlign: "center", padding: "60px 20px" },
  miniCard: { padding: 16, background: "#0D0D0F", borderRadius: 10, border: "1px solid #1E1E22", borderLeft: "3px solid" },
  miniLabel: { display: "block", fontSize: 11, color: "#666", fontFamily: "'Space Mono'", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 },
  miniValue: { fontFamily: "'Space Mono'", fontSize: 22, fontWeight: 700 },
  dot: { width: 8, height: 8, borderRadius: "50%", display: "inline-block" },
  oppTitle: { fontSize: 13, fontWeight: 600, color: "#ccc" },
  oppRow: { display: "flex", justifyContent: "space-between", padding: "8px 16px", fontSize: 13, color: "#aaa", borderBottom: "1px solid #1A1A1E" },
  resetBtn: { padding: "8px 20px", background: "transparent", border: "1px solid #333", borderRadius: 8, color: "#666", fontFamily: "'DM Sans'", fontSize: 12, cursor: "pointer", display: "inline-flex", alignItems: "center" },
};
