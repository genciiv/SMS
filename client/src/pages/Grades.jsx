import { useState } from "react";
import api from "../lib/api";

export default function Grades() {
  const [studentId, setStudentId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [term, setTerm] = useState("Sem I");
  const [type, setType] = useState("test");
  const [weight, setWeight] = useState(0.3);
  const [valueNumeric, setValueNumeric] = useState("");
  const [valueLetter, setValueLetter] = useState("");
  const [list, setList] = useState([]);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  async function create() {
    setErr(""); setOk("");
    try {
      const payload = { studentId, subjectId, teacherId, term, type, weight: Number(weight) };
      if (valueNumeric) payload.valueNumeric = Number(valueNumeric);
      if (valueLetter) payload.valueLetter = valueLetter;
      await api.post("/api/grades", payload);
      setOk("Nota u shtua.");
      fetchList();
    } catch (e) {
      setErr(e?.response?.data?.message || "Gabim gjatë shtimit të notës.");
    }
  }

  async function fetchList() {
    setErr(""); setOk("");
    try {
      const { data } = await api.get("/api/grades", { params: { studentId, subjectId, term }});
      setList(data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Gabim gjatë leximit të notave.");
    }
  }

  return (
    <div className="page">
      <h1>Notat</h1>
      <div className="card">
        <div className="grid-3">
          <input className="form__input" placeholder="studentId" value={studentId} onChange={(e)=>setStudentId(e.target.value)} />
          <input className="form__input" placeholder="subjectId" value={subjectId} onChange={(e)=>setSubjectId(e.target.value)} />
          <input className="form__input" placeholder="teacherId" value={teacherId} onChange={(e)=>setTeacherId(e.target.value)} />
        </div>
        <div className="grid-4">
          <select className="form__input" value={term} onChange={(e)=>setTerm(e.target.value)}>
            <option>Sem I</option>
            <option>Sem II</option>
          </select>
          <select className="form__input" value={type} onChange={(e)=>setType(e.target.value)}>
            <option value="detyrë">detyrë</option>
            <option value="test">test</option>
            <option value="projekt">projekt</option>
            <option value="provim">provim</option>
            <option value="gojore">gojore</option>
            <option value="praktike">praktike</option>
          </select>
          <input type="number" step="0.1" className="form__input" placeholder="peshë (0-1)"
                 value={weight} onChange={(e)=>setWeight(e.target.value)} />
          <input className="form__input" placeholder="nota me shkronjë (A-F)" value={valueLetter}
                 onChange={(e)=>setValueLetter(e.target.value.toUpperCase())} />
        </div>
        <div className="grid-2">
          <input type="number" min="4" max="10" className="form__input" placeholder="nota numerike (4-10)"
                 value={valueNumeric} onChange={(e)=>setValueNumeric(e.target.value)} />
          <button className="btn btn--primary" onClick={create}>Shto notë</button>
        </div>

        {err && <div className="form__error">{err}</div>}
        {ok && <div className="form__ok">{ok}</div>}
      </div>

      <div className="card">
        <div className="actions">
          <button className="btn btn--ghost" onClick={fetchList}>Shfaq notat</button>
        </div>
        <div className="table">
          <div className="thead grid-6">
            <div>Data</div><div>Lënda</div><div>Tipi</div><div>Pesha</div><div>Num</div><div>Letër</div>
          </div>
          {list.map(g => (
            <div key={g._id} className="trow grid-6">
              <div>{(g.date || g.createdAt || "").slice(0,10)}</div>
              <div>{g.subjectId?.name || g.subjectId}</div>
              <div>{g.type}</div>
              <div>{g.weight}</div>
              <div>{g.valueNumeric ?? "-"}</div>
              <div>{g.valueLetter ?? "-"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
