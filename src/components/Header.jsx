import { LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import styles from "../styles/styles";

export default function Header() {
  const { signOut } = useAuth();

  return (
    <div style={styles.header} className="r-header">
      <div>
        <h1 style={styles.title} className="r-title">Control de Gastos</h1>
        <p style={styles.subtitle}>Visualiza, controla y ahorra</p>
      </div>
      <div style={styles.headerRight} className="r-header-right">
        <div style={styles.monthBadge}>
          {new Date().toLocaleDateString("es-MX", { month: "long", year: "numeric" })}
        </div>
        <button onClick={signOut} style={styles.logoutBtn} className="btn-hover">
          <LogOut size={12} />
          Salir
        </button>
      </div>
    </div>
  );
}
