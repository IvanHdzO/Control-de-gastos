import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
  const { user, signIn, signUp, signInWithGoogle } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const { error: authError } = isRegister
      ? await signUp(email, password)
      : await signIn(email, password);

    if (authError) {
      setError(authError.message);
    } else if (isRegister) {
      setMessage("Revisa tu correo para confirmar tu cuenta.");
    }
    setLoading(false);
  };

  return (
    <div style={loginStyles.root}>
      <div style={loginStyles.card}>
        <div style={loginStyles.logoSection}>
          <h1 style={loginStyles.title}>Control de Gastos</h1>
          <p style={loginStyles.subtitle}>Visualiza, controla y ahorra</p>
        </div>

        <form onSubmit={handleSubmit} style={loginStyles.form}>
          <div style={loginStyles.field}>
            <label style={loginStyles.label}>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              style={loginStyles.input}
              required
            />
          </div>
          <div style={loginStyles.field}>
            <label style={loginStyles.label}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={loginStyles.input}
              required
              minLength={6}
            />
          </div>

          {error && <p style={loginStyles.error}>{error}</p>}
          {message && <p style={loginStyles.success}>{message}</p>}

          <button type="submit" style={loginStyles.submitBtn} disabled={loading}>
            {loading ? "Cargando..." : isRegister ? "Crear Cuenta" : "Iniciar Sesión"}
          </button>
        </form>

        <div style={loginStyles.divider}>
          <span style={loginStyles.dividerLine} />
          <span style={loginStyles.dividerText}>o</span>
          <span style={loginStyles.dividerLine} />
        </div>

        <button onClick={signInWithGoogle} style={loginStyles.googleBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continuar con Google
        </button>

        <p style={loginStyles.toggle}>
          {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
          <button
            onClick={() => { setIsRegister(!isRegister); setError(""); setMessage(""); }}
            style={loginStyles.toggleBtn}
          >
            {isRegister ? "Inicia Sesión" : "Regístrate"}
          </button>
        </p>
      </div>
    </div>
  );
}

const loginStyles = {
  root: {
    fontFamily: "'DM Sans', sans-serif",
    background: "#0D0D0F",
    color: "#E8E8E8",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    background: "#131316",
    border: "1px solid #1E1E22",
    borderRadius: 16,
    padding: 36,
    width: "100%",
    maxWidth: 400,
  },
  logoSection: { textAlign: "center", marginBottom: 32 },
  title: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 24,
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.5px",
    marginBottom: 4,
  },
  subtitle: { fontSize: 13, color: "#666", letterSpacing: "0.5px" },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  field: {},
  label: {
    display: "block",
    fontSize: 11,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontFamily: "'Space Mono'",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    background: "#0D0D0F",
    border: "1px solid #2A2A30",
    borderRadius: 8,
    color: "#fff",
    fontFamily: "'DM Sans'",
    fontSize: 14,
    boxSizing: "border-box",
  },
  error: { color: "#C44A4A", fontSize: 13, margin: 0 },
  success: { color: "#4A9B7F", fontSize: 13, margin: 0 },
  submitBtn: {
    padding: "12px 24px",
    background: "#4A9B7F",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    fontFamily: "'DM Sans'",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 4,
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    margin: "20px 0",
  },
  dividerLine: { flex: 1, height: 1, background: "#2A2A30" },
  dividerText: { fontSize: 12, color: "#555", fontFamily: "'Space Mono'" },
  googleBtn: {
    width: "100%",
    padding: "10px 16px",
    background: "transparent",
    border: "1px solid #2A2A30",
    borderRadius: 8,
    color: "#ccc",
    fontFamily: "'DM Sans'",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  toggle: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 13,
    color: "#666",
  },
  toggleBtn: {
    background: "none",
    border: "none",
    color: "#4A9B7F",
    cursor: "pointer",
    fontFamily: "'DM Sans'",
    fontSize: 13,
    fontWeight: 600,
    padding: 0,
  },
};
