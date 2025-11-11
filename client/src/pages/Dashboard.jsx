import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Dashboard() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));
  const [notes, setNotes] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    try {
      const { data } = await api.get("/api/notifications");
      setNotes(data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Gabim gjatë marrjes së njoftimeve.");
    }
  }

  useEffect(() => { load(); }, []);

  async function markRead(id) {
    try {
      await api.post(`/api/notifications/${id}/read`);
      setNotes((prev) => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch {}
  }

  return (
    <div className="page">
      <h1>Mirësevini në G-coode</h1>
      <p style={{ marginTop: 0 }}>
        Përdoruesi: <strong>{user.firstName} {user.lastName}</strong> — roli: <strong>{user.role}</strong>
      </p>

      <div className="card">
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <h2 style={{margin:"0 0 8px"}}>Njoftimet</h2>
          <a className="link" href="/notifications">Shiko të gjitha</a>
        </div>

        {err && <div className="form__error">{err}</div>}

        <div className="table">
          <div className="thead grid-4">
            <div>Titulli</div><div>Për</div><div>Data</div><div>Status</div>
          </div>
          {notes.slice(0,5).map(n => (
            <div key={n._id} className="trow grid-4">
              <div>{n.title}</div>
              <div>{(n.audience || []).join(", ")}</div>
              <div>{new Date(n.createdAt).toLocaleString()}</div>
              <div>
                {n.isRead ? "Lexuar" : (
                  <button className="btn btn--ghost" onClick={() => markRead(n._id)}>Shëno si lexuar</button>
                )}
              </div>
            </div>
          ))}
          {notes.length === 0 && <div className="trow">S’ka njoftime.</div>}
        </div>
      </div>
    </div>
  );
}
