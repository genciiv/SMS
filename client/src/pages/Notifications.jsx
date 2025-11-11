import { useEffect, useState } from "react";
import api from "../lib/api";

const AUDIENCE = [
  { val: "te_gjithe", label: "Të gjithë" },
  { val: "admin", label: "Admin" },
  { val: "sekretari", label: "Sekretari" },
  { val: "mesues", label: "Mësues" },
  { val: "nxenes", label: "Nxënës" },
  { val: "prind", label: "Prind" }
];

export default function Notifications() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const canCreate = ["admin", "sekretari", "mesues"].includes(user.role);

  const [list, setList] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState(["te_gjithe"]);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  async function load() {
    setErr("");
    try {
      const { data } = await api.get("/api/notifications");
      setList(data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Gabim gjatë marrjes së njoftimeve.");
    }
  }

  useEffect(() => { load(); }, []);

  async function create() {
    setErr(""); setOk("");
    try {
      await api.post("/api/notifications", { title, body, audience });
      setOk("Njoftimi u publikua.");
      setTitle(""); setBody("");
      load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Gabim gjatë publikimit të njoftimit.");
    }
  }

  async function markRead(id) {
    try {
      await api.post(`/api/notifications/${id}/read`);
      setList(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch {}
  }

  async function remove(id) {
    setErr(""); setOk("");
    try {
      await api.delete(`/api/notifications/${id}`);
      setOk("Njoftimi u fshi.");
      setList(prev => prev.filter(n => n._id !== id));
    } catch (e) {
      setErr(e?.response?.data?.message || "S'u fshi.");
    }
  }

  function toggleAudience(val) {
    setAudience(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  }

  return (
    <div className="page">
      <h1>Njoftime</h1>

      {canCreate && (
        <div className="card">
          <h2>Publiko njoftim</h2>
          <div className="grid-2">
            <input className="form__input" placeholder="Titulli" value={title} onChange={e=>setTitle(e.target.value)} />
            <div className="form__input" style={{display:"flex", gap:8, flexWrap:"wrap", alignItems:"center", padding:"8px"}}>
              {AUDIENCE.map(a => (
                <label key={a.val} style={{display:"flex",gap:6,alignItems:"center"}}>
                  <input
                    type="checkbox"
                    checked={audience.includes(a.val)}
                    onChange={()=>toggleAudience(a.val)}
                  />
                  {a.label}
                </label>
              ))}
            </div>
          </div>
          <textarea className="form__input" placeholder="Përmbajtje (ops.)" value={body} onChange={e=>setBody(e.target.value)} />

          {err && <div className="form__error">{err}</div>}
          {ok && <div className="form__ok">{ok}</div>}

          <div className="actions">
            <button className="btn btn--primary" onClick={create}>Publiko</button>
            <button className="btn btn--ghost" onClick={load}>Rifresko</button>
          </div>
        </div>
      )}

      <div className="card">
        <h2>Të gjitha njoftimet</h2>
        <div className="table">
          <div className="thead grid-5">
            <div>Titulli</div><div>Për</div><div>Data</div><div>Status</div><div>Veprime</div>
          </div>
          {list.map(n => (
            <div key={n._id} className="trow grid-5">
              <div><strong>{n.title}</strong><div style={{color:"var(--muted)"}}>{n.body}</div></div>
              <div>{(n.audience || []).join(", ")}</div>
              <div>{new Date(n.createdAt).toLocaleString()}</div>
              <div>{n.isRead ? "Lexuar" : <span>Pa lexuar</span>}</div>
              <div style={{display:"flex", gap:8}}>
                {!n.isRead && <button className="btn btn--ghost" onClick={()=>markRead(n._id)}>Shëno si lexuar</button>}
                {["admin","sekretari"].includes(user.role) && (
                  <button className="btn btn--ghost" onClick={()=>remove(n._id)}>Fshi</button>
                )}
              </div>
            </div>
          ))}
          {list.length === 0 && <div className="trow">S’ka njoftime.</div>}
        </div>
      </div>
    </div>
  );
}
