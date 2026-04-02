import styles from "../styles/styles";

export default function Header() {
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
      </div>
    </div>
  );
}
