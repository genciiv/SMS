import { useEffect, useState } from "react";
import api from "../lib/api";
import useFetch from "../lib/useFetch";

const AUDIENCE = [
  { val: "te_gjithe", label: "Të gjithë" },
  { val: "admin", label: "Admin" },
  { val: "sekretari", label: "Sekretari" },
  { val: "mesues", label: "Mësues" },
  { val: "nxenes", label: "Nxënës" },
  { val: "prind", label: "Prind" }
];

export default function CalendarPage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const canCreate = ["admin","sekretari","mesues"].includes(user.role);

  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
  const endOfMonth = new Date(today.getFullYear(), today.getMonth()+1, 0, 23,59,59).toISOString();

  const [from, setFrom] = useState(startOfMonth);
  const [to, setTo] = useState(endOfMonth);
  const [list, setList] = useState([]);
  const [err, setErr] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [location, setLocation] = useState("");
  const [audience, setAudience] = useState(["te_gjithe"]);

  const { data: classes } = useFetch("/api/lookup/classes");
  const { data: subjects } = useFetch("/api/lookup/subjects");

  async function load() {
    setErr("");
    try {
      const { data } = await api.get("/api/events", { params: { from, to } });
      setList(data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Gabim gjatë marrjes së eventeve.");
    }
  }

  useEffect(() => { load(); }, []);

  function toggleAudience(val) {
    setAudience(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  }

  async function create() {
    try {
      await api.post("/api/events", { title, description, startAt, endAt, location, audience });
      setTitle(""); setDescription(""); setStartAt(""); setEndAt(""); setLocation("");
      load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Gabim gjatë krijimit të eventit.");
    }
  }

  async function remove(id) {
    try {
      await api.delete(`/api/events/${id}`);
      setList(prev => prev.filter(e => e._id !== id));
    } catch {}
  }

  return (
    <div className="page">
      <h1>Kalendar</h1>

      <div className="card">
        <div className="grid-3">
          <input type="datetime-local" className="form__input" value={from.slice(0,16)} onChange={e=>setFrom(new Date(e.target.value).toISOString())} />
          <input type="datetime-local" className="form__input" value={to.slice(0,16)} onChange={e=>setTo(new Date(e.target.value).toISOString())} />
          <button className="btn btn--ghost" onClick={load}>Rifresko</button>
        </div>
      </div>

      {canCreate && (
        <div className="card">
          <h2>Shto ngjarje</h2>
          <div className="grid-2">
            <input className="form__input" placeholder="Titulli" value={title} onChange={e=>setTitle(e.target.value)} />
            <input className="form__input" placeholder="Lokacioni (ops.)" value={location} onChange={e=>setLocation(e.target.value)} />
          </div>
          <div className="grid-2">
            <input type="datetime-local" className="form__input" value={startAt} onChange={e=>setStartAt(e.target.value)} />
            <input type="datetime-local" className="form__input" value={endAt} onChange={e=>setEndAt(e.target.value)} />
          </div>
          <textarea className="form__input" placeholder="Përshkrimi (ops.)" value={description} onChange={e=>setDescription(e.target.value)} />
          <div className="form__input" style={{display:"flex", gap:8, flexWrap:"wrap", alignItems:"center", padding:"8px"}}>
            {AUDIENCE.map(a => (
              <label key={a.val} style={{display:"flex",gap:6,alignItems:"center"}}>
                <input type="checkbox" checked={audience.includes(a.val)} onChange={()=>toggleAudience(a.val)} />
                {a.label}
              </label>
            ))}
          </div>
          {err && <div className="form__error">{err}</div>}
          <div className="actions">
            <button className="btn btn--primary" onClick={create}>Krijo ngjarje</button>
          </div>
        </div>
      )}

      <div className="card">
        <h2>Ngjarjet</h2>
        <div className="table">
          <div className="thead grid-5">
            <div>Titulli</div><div>Data</div><div>Lokacioni</div><div>Për</div><div>Veprime</div>
          </div>
        {list.map(ev => (
          <div key={ev._id} className="trow grid-5">
            <div><strong>{ev.title}</strong><div style={{color:"var(--muted)"}}>{ev.description}</div></div>
            <div>{new Date(ev.startAt).toLocaleString()} — {new Date(ev.endAt).toLocaleString()}</div>
            <div>{ev.location || "-"}</div>
            <div>{(ev.audience || []).join(", ")}</div>
            <div>
              {["admin","sekretari"].includes(user.role) && (
                <button className="btn btn--ghost" onClick={()=>remove(ev._id)}>Fshi</button>
              )}
            </div>
          </div>
        ))}
        {list.length === 0 && <div className="trow">S’ka evente.</div>}
        </div>
      </div>
    </div>
  );
}
