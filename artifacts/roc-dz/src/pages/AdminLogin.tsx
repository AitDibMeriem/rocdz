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
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1 className="admin-login-logo">R⊙C DZ</h1>
          <p className="admin-login-subtitle">Accès Administration</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div>
            <label className="admin-login-label">Nom d'utilisateur</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="admin-login-input"
            />
          </div>
          <div>
            <label className="admin-login-label">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="admin-login-input"
            />
          </div>

          {error && (
            <div className="admin-login-error">{error}</div>
          )}

          <button type="submit" disabled={loading} className="admin-login-btn">
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="admin-login-footer">
          <Link href="/" className="admin-login-back">← Retour à l'accueil</Link>
          <p className="admin-login-copy">ROC DZ © 2026 — Accès restreint</p>
        </div>
      </div>
    </div>
  );
}
