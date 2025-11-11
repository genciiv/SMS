import { useState, useEffect } from "react";
import api from "../lib/api";
import dayjs from "dayjs";

function Row({ i, row, onChange, onRemove }) {
  return (
    <div className="grid-4 items-row">
      <input className="form__input" placeholder="studentId" value={row.studentId}
             onChange={(e) => onChange(i, { ...row, studentId: e.target.value })} />
      <select className="form__input" value={row.status}
              onChange={(e) => onChange(i, { ...row, status: e.target.value })}>
        <option value="prezent">prezent</option>
        <option value="mungese">mungese</option>
        <option value="vonesë">vonesë</option>
      </select>
      <input className="form__input" placeholder="arsye (ops.)" value={row.reason}
             onChange={(e) => onChange(i, { ...row, reason: e.target.value })} />
      <button type="button" className="btn btn--ghost" onClick={() => onRemove(i)}>Hiq</button>
    </div>
  );
}

export default function Attendance() {
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [lessonNr, setLessonNr] = useState(1);
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [items, setItems] = useState([{ studentId: "", status: "prezent", reason: "" }]);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [list, setList] = useState([]);

  function addRow() { setItems([...items, { studentId: "", status: "prezent", reason: "" }]); }
  function changeRow(i, value) { const c=[...items]; c[i]=value; setItems(c); }
  function removeRow(i) { setItems(items.filter((_,idx)=>idx!==i)); }

  async function save() {
    setErr(""); setOk("");
    if (!classId || !subjectId || !teacherId) { setErr("Vendos classId, subjectId, teacherId"); return; }
    try {
      const { data } = await api.post(`/api/attendance/${classId}/${subjectId}`, {
        date, lessonNr: Number(lessonNr), items, teacherId
      });
      setOk("U ruajt prezenca.");
    } catch (e) {
      setErr(e?.response?.data?.message || "Gabim gjatë ruajtjes.");
    }
  }

  async function fetchList() {
    setErr("");
    try {
      const { data } = await api.get("/api/attendance", { params: { classId, subjectId, date }});
      setList(data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Gabim gjatë marrjes së të dhënave.");
    }
  }

  useEffect(() => { fetchList(); /* auto load në fillim me filtra bosh */ }, []);

  return (
    <div className="page">
      <h1>Prezenca</h1>

      <div className="card">
        <div className="grid-5">
          <input type="date" className="form__input" value={date} onChange={(e)=>setDate(e.target.value)} />
          <input type="number" min="1" max="10" className="form__input" value={lessonNr} onChange={(e)=>setLessonNr(e.target.value)} placeholder="Ora #" />
          <input className="form__input" placeholder="classId" value={classId} onChange={(e)=>setClassId(e.target.value)} />
          <input className="form__input" placeholder="subjectId" value={subjectId} onChange={(e)=>setSubjectId(e.target.value)} />
          <input className="form__input" placeholder="teacherId" value={teacherId} onChange={(e)=>setTeacherId(e.target.value)} />
        </div>

        <div className="items">
          {items.map((row, i) => (
            <Row key={i} i={i} row={row} onChange={changeRow} onRemove={removeRow} />
          ))}
        </div>

        {err && <div className="form__error" style={{marginTop:8}}>{err}</div>}
        {ok && <div className="form__ok" style={{marginTop:8}}>{ok}</div>}

        <div className="actions">
          <button className="btn btn--ghost" type="button" onClick={addRow}>+ Shto rresht</button>
          <button className="btn btn--primary" type="button" onClick={save}>Ruaj prezencën</button>
        </div>
      </div>

      <div className="card">
        <div className="grid-3">
          <input className="form__input" placeholder="classId (filter)" value={classId} onChange={(e)=>setClassId(e.target.value)} />
          <input className="form__input" placeholder="subjectId (filter)" value={subjectId} onChange={(e)=>setSubjectId(e.target.value)} />
          <input type="date" className="form__input" value={date} onChange={(e)=>setDate(e.target.value)} />
        </div>
        <button className="btn btn--ghost" onClick={fetchList}>Rifresko listën</button>

        <div className="table">
          <div className="thead grid-4">
            <div>Data</div><div>Ora</div><div>Klasë/Lëndë</div><div>Nr. rreshtash</div>
          </div>
          {list.map(a => (
            <div key={a._id} className="trow grid-4">
              <div>{a.date?.slice(0,10)}</div>
              <div>{a.lessonNr}</div>
              <div>{a.classId?.name} / {a.subjectId?.name || a.subjectId}</div>
              <div>{a.items?.length || 0}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
