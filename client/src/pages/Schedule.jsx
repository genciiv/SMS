import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import useFetch from "../lib/useFetch";

const DAYS = [
  { v:1, l:"E Hënë" }, { v:2, l:"E Martë" }, { v:3, l:"E Mërkurë" },
  { v:4, l:"E Enjte" }, { v:5, l:"E Premte" }, { v:6, l:"E Shtunë" }, { v:7, l:"E Diel" }
];

export default function SchedulePage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const canEdit = ["admin","sekretari"].includes(user.role);

  const { data: classes } = useFetch("/api/lookup/classes");
  const { data: subjects } = useFetch("/api/lookup/subjects");
  const { data: teachers } = useFetch("/api/lookup/teachers");

  const [classId, setClassId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  async function load() {
    setErr("");
    try {
      const { data } = await api.get("/api/schedules", { params: { classId, teacherId } });
      setRows(data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Gabim gjatë leximit të orarit.");
    }
  }
  useEffect(() => { load(); }, []); // on mount

  async function upsert(slot) {
    setErr(""); setOk("");
    try {
      await api.post("/api/schedules", slot);
      setOk("Slot u ruajt.");
      load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Gabim gjatë ruajtjes.");
    }
  }

  async function remove(id) {
    setErr(""); setOk("");
    try {
      await api.delete(`/api/schedules/${id}`);
      setOk("Slot u fshi.");
      setRows(prev => prev.filter(x => x._id !== id));
    } catch (e) {
      setErr(e?.response?.data?.message || "S'u fshi.");
    }
  }

  const grid = useMemo(() => {
    // strukturo në { weekday -> { lessonNr -> array slots } }
    const m = {};
    for (const r of rows) {
      m[r.weekday] ||= {};
      m[r.weekday][r.lessonNr] ||= [];
      m[r.weekday][r.lessonNr].push(r);
    }
    return m;
  }, [rows]);

  // form i shpejtë për upsert
  const [weekday, setWeekday] = useState(1);
  const [lessonNr, setLessonNr] = useState(1);
  const [subjectId, setSubjectId] = useState("");
  const [teacherIdForm, setTeacherIdForm] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [room, setRoom] = useState("");

  return (
    <div className="page">
      <h1>Orari</h1>

      <div className="card">
        <div className="grid-3">
          <select className="form__input" value={classId} onChange={(e)=>setClassId(e.target.value)}>
            <option value="">— Klasë —</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name || c.label}</option>)}
          </select>
          <select className="form__input" value={teacherId} onChange={(e)=>setTeacherId(e.target.value)}>
            <option value="">— Mësues (filter) —</option>
            {teachers.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          <button className="btn btn--ghost" onClick={load}>Rifresko</button>
        </div>
      </div>

      {canEdit && (
        <div className="card">
          <h2>Shto/ndrysho slot</h2>
          <div className="grid-5">
            <select className="form__input" value={weekday} onChange={(e)=>setWeekday(Number(e.target.value))}>
              {DAYS.map(d => <option key={d.v} value={d.v}>{d.l}</option>)}
            </select>
            <input type="number" min="1" max="12" className="form__input" placeholder="Ora #" value={lessonNr} onChange={(e)=>setLessonNr(Number(e.target.value))} />
            <select className="form__input" value={subjectId} onChange={(e)=>setSubjectId(e.target.value)}>
              <option value="">— Lëndë —</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
            <select className="form__input" value={teacherIdForm} onChange={(e)=>setTeacherIdForm(e.target.value)}>
              <option value="">— Mësues —</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
            <select className="form__input" value={classId} onChange={(e)=>setClassId(e.target.value)}>
              <option value="">— Klasë —</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name || c.label}</option>)}
            </select>
          </div>
          <div className="grid-3">
            <input className="form__input" placeholder="08:00" value={startTime} onChange={(e)=>setStartTime(e.target.value)} />
            <input className="form__input" placeholder="08:45" value={endTime} onChange={(e)=>setEndTime(e.target.value)} />
            <input className="form__input" placeholder="Klasa A1" value={room} onChange={(e)=>setRoom(e.target.value)} />
          </div>
          {err && <div className="form__error">{err}</div>}
          {ok && <div className="form__ok">{ok}</div>}
          <div className="actions">
            <button
              className="btn btn--primary"
              onClick={() => upsert({ classId, subjectId, teacherId: teacherIdForm, weekday, lessonNr, startTime, endTime, room })}
            >
              Ruaj slot
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <h2>Orari i javës</h2>
        {DAYS.map(d => (
          <div key={d.v} style={{marginBottom: 16}}>
            <h3 style={{marginBottom:8}}>{d.l}</h3>
            <div className="table">
              <div className="thead grid-5">
                <div>Ora #</div><div>Lënda</div><div>Mësuesi</div><div>Koha</div><div>Veprime</div>
              </div>
              {Object.keys(grid[d.v] || {}).length === 0 && <div className="trow">— asgjë —</div>}
              {Object.entries(grid[d.v] || {}).map(([ln, slots]) =>
                slots.map(s => (
                  <div key={s._id} className="trow grid-5">
                    <div>{ln}</div>
                    <div>{s.subjectId?.name || s.subjectId}</div>
                    <div>{s.teacherId?.user || s.teacherId}</div>
                    <div>{s.startTime && s.endTime ? `${s.startTime}–${s.endTime}` : "-"}</div>
                    <div>
                      {canEdit && <button className="btn btn--ghost" onClick={()=>remove(s._id)}>Fshi</button>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
