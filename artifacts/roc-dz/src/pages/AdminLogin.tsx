import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation, Link } from "wouter";

export default function AdminLogin() {
  const { login } = useAuth();
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      if (username === "superroc") {
        navigate("/super-admin");
      } else {
        navigate("/admin");
      }
    } catch {
      setError("Nom d'utilisateur ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-deep, #0d0218)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, sans-serif",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "20px",
        padding: "48px",
        width: "100%",
        maxWidth: "420px",
        backdropFilter: "blur(20px)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{
            fontSize: "2rem",
            fontWeight: 900,
            background: "linear-gradient(135deg, #e91e8c 0%, #b829dd 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "2px",
            marginBottom: "8px",
          }}>R⊙C DZ</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", letterSpacing: "2px", textTransform: "uppercase" }}>
            Accès Administration
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
              Nom d'utilisateur
            </label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoComplete="username"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                padding: "12px 16px",
                color: "#fff",
                fontSize: "0.95rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                padding: "12px 16px",
                color: "#fff",
                fontSize: "0.95rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <div style={{ background: "rgba(233,30,140,0.1)", border: "1px solid rgba(233,30,140,0.3)", borderRadius: "8px", padding: "10px 14px", color: "#e91e8c", fontSize: "0.85rem" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #e91e8c 0%, #b829dd 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "50px",
              padding: "14px",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.3s",
              letterSpacing: "1px",
            }}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <Link href="/" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "rgba(255,255,255,0.5)",
            fontSize: "0.8rem",
            textDecoration: "none",
            padding: "8px 20px",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "50px",
            transition: "all 0.3s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
          >
            ← Retour à l'accueil
          </Link>
          <p style={{ marginTop: "16px", color: "rgba(255,255,255,0.2)", fontSize: "0.7rem" }}>ROC DZ © 2026 — Accès restreint</p>
        </div>
      </div>
    </div>
  );
}
