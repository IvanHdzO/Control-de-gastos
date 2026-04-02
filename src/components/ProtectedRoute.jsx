import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import styles from "../styles/styles";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
