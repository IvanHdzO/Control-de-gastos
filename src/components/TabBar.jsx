import { LayoutDashboard, List, PiggyBank } from "lucide-react";
import styles from "../styles/styles";

const TABS = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "gastos", label: "Mis Gastos", Icon: List },
  { id: "ahorro", label: "Ahorro", Icon: PiggyBank },
];

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <div style={styles.tabs}>
      {TABS.map((t) => (
        <button
          key={t.id}
          className="tab-btn"
          onClick={() => onTabChange(t.id)}
          style={{ ...styles.tab, ...(activeTab === t.id ? styles.tabActive : {}) }}
        >
          <t.Icon size={14} style={{ marginRight: 6, opacity: activeTab === t.id ? 1 : 0.5 }} />
          {t.label}
        </button>
      ))}
    </div>
  );
}
