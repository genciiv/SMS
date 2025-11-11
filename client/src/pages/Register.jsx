import { useState } from "react";
import api from "../lib/api";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("nxenes");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/register", {
        firstName,
        lastName,
        email,
        password,
        role,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/"; // në dashboard
    } catch (error) {
      setErr(error?.response?.data?.message || "Gabim gjatë regjistrimit.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="auth__title">G-coode — Regjistrohu</h1>
        <form onSubmit={handleSubmit} className="auth__form">
          <label className="form__label">
            Emri
            <input
              type="text"
              className="form__input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>

          <label className="form__label">
            Mbiemri
            <input
              type="text"
              className="form__input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>

          <label className="form__label">
            Email
            <input
              type="email"
              className="form__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              required
            />
          </label>

          <label className="form__label">
            Roli
            <select
              className="form__input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="nxenes">Nxënës</option>
              <option value="prind">Prind</option>
              <option value="mesues">Mësues</option>
              <option value="sekretari">Sekretari</option>
              <option value="admin">Drejtori / Admin</option>
            </select>
          </label>

          {err && <div className="form__error">{err}</div>}

          <button className="btn btn--primary" disabled={loading}>
            {loading ? "Duke u regjistruar..." : "Regjistrohu"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Ke llogari?{" "}
          <a href="/login" style={{ color: "var(--primary)" }}>
            Hyr këtu
          </a>
        </p>
      </div>
    </div>
  );
}
