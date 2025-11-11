import { useState } from "react";
import api from "../lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/"; // në dashboard
    } catch (error) {
      setErr(error?.response?.data?.message || "Gabim gjatë hyrjes.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="auth__title">G-coode — Hyrje</h1>
        <form onSubmit={handleSubmit} className="auth__form">
          <label className="form__label">
            Email
            <input
              type="email"
              className="form__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="shembull@email.com"
              required
            />
          </label>

          <label className="form__label">
            Fjalëkalim
            <input
              type="password"
              className="form__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {err && <div className="form__error">{err}</div>}

          <button className="btn btn--primary" disabled={loading}>
            {loading ? "Duke u futur..." : "Hyr"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Nuk ke llogari?{" "}
          <a href="/register" style={{ color: "var(--primary)" }}>
            Regjistrohu këtu
          </a>
        </p>
      </div>
    </div>
  );
}
