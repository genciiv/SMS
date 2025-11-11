import { useEffect, useState } from "react";
import api from "../lib/api";
import useFetch from "../lib/useFetch";

export default function Assignments() {
  const { data: classes } = useFetch("/api/lookup/classes");
  const { data: subjects } = useFetch("/api/lookup/subjects");
  const { data: teachers } = useFetch("/api/lookup/teachers");

  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [list, setList] = useState([]);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  async function createAssignment() {
    setErr(""); setOk("");
    try {
      await api.post("/api/assignments", { classId, subjectId, teacherId, title, description, dueAt });
      setOk("Detyra u krijua.");
      setTitle(""); setDescription(""); setDueAt("");
      fetchAssignments();
    } catch (e) {
      setErr(e?.response?.data?.message || "Gabim gjatë krijimit.");
    }
  }

  async function fetchAssignments() {
    setErr("");
    try {
      const { data } = await api.get("/api/assignments", { params: { classId, subjectId } });
      setList(data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Gabim gjatë leximit.");
    }
  }

  useEffect(() => { fetchAssignments(); }, []);

  return (
    <div className="page">
      <h1>Detyrat</h1>

      <div className="card">
        <div className="grid-3">
          <select className="form__input" value={classId} onChange={(e)=>setClassId(e.target.value)}>
            <option value="">— Klasë —</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name || c.label}</option>)}
          </select>
          <select className="form__input" value={subjectId} onChange={(e)=>setSubjectId(e.target.value)}>
            <option value="">— Lëndë —</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <select className="form__input" value={teacherId} onChange={(e)=>setTeacherId(e.target.value)}>
            <option value="">— Mësues —</option>
            {teachers.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>

        <div className="grid-2">
          <input className="form__input" placeholder="Titulli" value={title} onChange={(e)=>setTitle(e.target.value)} />
          <input type="datetime-local" className="form__input" value={dueAt} onChange={(e)=>setDueAt(e.target.value)} />
        </div>

        <textarea className="form__input" placeholder="Përshkrimi (ops.)" value={description} onChange={(e)=>setDescription(e.target.value)} />

        {err && <div className="form__error">{err}</div>}
        {ok && <div className="form__ok">{ok}</div>}

        <div className="actions">
          <button className="btn btn--primary" onClick={createAssignment}>Krijo detyrë</button>
          <button className="btn btn--ghost" onClick={fetchAssignments}>Rifresko listën</button>
        </div>
      </div>

      <div className="card">
        <div className="table">
          <div className="thead grid-4">
            <div>Titulli</div><div>Klasë/Lëndë</div><div>Afati</div><div>Veprime</div>
          </div>
          {list.map((a) => (
            <div key={a._id} className="trow grid-4">
              <div>{a.title}</div>
              <div>{a.classId?.name} / {a.subjectId?.name || a.subjectId}</div>
              <div>{new Date(a.dueAt).toLocaleString()}</div>
              <div><a className="link" href={`#subs-${a._id}`}>Dorëzime</a></div>
            </div>
          ))}
        </div>
      </div>

      <SubmissionsPanel />
    </div>
  );
}

function SubmissionsPanel() {
  const [assignmentId, setAssignmentId] = useState("");
  const [subs, setSubs] = useState([]);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  async function load() {
    setErr(""); setOk("");
    try {
      const { data } = await api.get(`/api/assignments/${assignmentId}/submissions`);
      setSubs(data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Gabim gjatë leximit të dorëzimeve.");
    }
  }

  async function grade(subId, gradeNumeric) {
    setErr(""); setOk("");
    try {
      await api.patch(`/api/assignments/submissions/${subId}/grade`, { gradeNumeric });
      setOk("Vlerësimi u ruajt.");
      load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Gabim gjatë vlerësimit.");
    }
  }

  return (
    <div className="card" id="submissions">
      <h2>Dorëzime & Vlerësim</h2>
      <div className="grid-2">
        <input className="form__input" placeholder="assignmentId" value={assignmentId} onChange={(e)=>setAssignmentId(e.target.value)} />
        <button className="btn btn--ghost" onClick={load}>Shfaq dorëzimet</button>
      </div>

      {err && <div className="form__error">{err}</div>}
      {ok && <div className="form__ok">{ok}</div>}

      <div className="table">
        <div className="thead grid-4">
          <div>Student</div><div>Dorëzuar më</div><div>Nota</div><div>Veprim</div>
        </div>
        {subs.map((s) => (
          <div key={s._id} className="trow grid-4">
            <div>{s.studentId?.user || s.studentId}</div>
            <div>{new Date(s.submittedAt).toLocaleString()}</div>
            <div>{s.gradeNumeric ?? "-"}</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[6, 7, 8, 9, 10].map((n) => (
                <button key={n} className="btn btn--ghost" onClick={() => grade(s._id, n)}>{n}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
