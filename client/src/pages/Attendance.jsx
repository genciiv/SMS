import { useEffect, useState } from "react";
import api from "../lib/api";
import useFetch from "../lib/useFetch";

function Row({ i, row, onChange, onRemove }) {
  return (
    <div className="grid-4 items-row">
      <select
        className="form__input"
        value={row.studentId}
        onChange={(e) => onChange(i, { ...row, studentId: e.target.value })}
      >
        <option value="">— Zgjidh nxënësin —</option>
        {row.students?.map((s) => (
          <option key={s.id} value={s.id}>{s.label}</option>
        ))}
      </select>

      <select
        className="form__input"
        value={row.status}
        onChange={(e) => onChange(i, { ...row, status: e.target.value })}
      >
        <option value="prezent">prezent</option>
        <option value="mungese">mungese</option>
        <option value="vonesë">vonesë</option>
      </select>

      <input
        className="form__input"
        placeholder="arsye (ops.)"
        value={row.reason}
        onChange={(e) => onChange(i, { ...row, reason: e.target.value })}
      />

      <button type="button" className="btn btn--ghost" onClick={() => onRemove(i)}>
        Hiq
      </button>
    </div>
  );
}

export default function Attendance() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [lessonNr, setLessonNr] = useState(1);
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [teacherId, setTeacherId] = useState("");

  const { data: classes } = useFetch("/api/lookup/classes");
  const { data: subjects } = useFetch("/api/lookup/subjects");
  const { data: teachers } = useFetch("/api/lookup/teachers");
  const { data: students } = useFetch("/api/lookup/students", classId ? { classId } : {});

  const [items, setItems] = useState([
    { studentId: "", status: "prezent", reason: "", students: [] },
  ]);

  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [list, setList] = useState([]);

  useEffect(() => {
    // kur ndryshon klasa, ri-mbus dropdown-et e rreshtave me nxënësit e asaj klase
    setItems((prev) =>
      prev.map((r) => ({ ...r, students }))
    );
  }, [students]);

  function addRow() {
    setItems([...items, { studentId: "", status: "prezent", reason: "", students }]);
  }
  function changeRow(i, value) {
    const c = [...items];
    c[i] = value;
    setItems(c);
  }
  function removeRow(i) {
    setItems(items.filter((_, idx) => idx !== i));
  }

  async function save() {
    setErr(""); setOk("");
    if (!classId || !subjectId || !teacherId) {
      setErr("Vendos klasën, lëndën dhe mësuesin.");
      return;
    }
    const clean = items
      .filter((r) => r.studentId)
      .map(({ studentId, status, reason }) => ({ studentId, status, reason }));

    if (!clean.length) {
      setErr("Shto të paktën një rresht me nxënës.");
      return;
    }

    try {
      await api.post(`/api/attendance/${classId}/${subjectId}`, {
        date,
        lessonNr: Number(lessonNr),
        items: clean,
        teacherId,
      });
      setOk("U ruajt prezenca.");
      fetchList(); // rifresko listën poshtë
    } catch (e) {
      setErr(e?.response?.data?.message || "Gabim gjatë ruajtjes.");
    }
  }

  async function fetchList() {
    setErr("");
    try {
      const { data } = await api.get("/api/attendance", {
        params: { classId, subjectId, date },
      });
      setList(data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Gabim gjatë marrjes së të dhënave.");
    }
  }

  useEffect(() => { fetchList(); }, []); // ngarko një herë

  return (
    <div className="page">
      <h1>Prezenca</h1>

      <div className="card">
        <div className="grid-5">
          <input
            type="date"
            className="form__input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="number"
            min="1"
            max="10"
            className="form__input"
            value={lessonNr}
            onChange={(e) => setLessonNr(e.target.value)}
            placeholder="Ora #"
          />

          <select
            className="form__input"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          >
            <option value="">— Zgjidh klasën —</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name || c.label}
              </option>
            ))}
          </select>

          <select
            className="form__input"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            <option value="">— Zgjidh lëndën —</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>

          <select
            className="form__input"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
          >
            <option value="">— Zgjidh mësuesin —</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="actions" style={{ marginTop: 8 }}>
          <button
            className="btn btn--ghost"
            type="button"
            onClick={() => {
              if (!students.length) return;
              setItems(students.map((s) => ({
                studentId: s.id, status: "prezent", reason: "", students
              })));
            }}
          >
            Mbush nxënësit e klasës
          </button>
          <button className="btn btn--ghost" type="button" onClick={addRow}>
            + Shto rresht
          </button>
          <button className="btn btn--primary" type="button" onClick={save}>
            Ruaj prezencën
          </button>
        </div>

        {err && <div className="form__error" style={{ marginTop: 8 }}>{err}</div>}
        {ok && <div className="form__ok" style={{ marginTop: 8 }}>{ok}</div>}
      </div>

      <div className="card">
        <div className="grid-3">
          <select
            className="form__input"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          >
            <option value="">— Klasë (filter) —</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name || c.label}
              </option>
            ))}
          </select>
          <select
            className="form__input"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            <option value="">— Lëndë (filter) —</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="form__input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button className="btn btn--ghost" onClick={fetchList}>
          Rifresko listën
        </button>

        <div className="table">
          <div className="thead grid-4">
            <div>Data</div>
            <div>Ora</div>
            <div>Klasë / Lëndë</div>
            <div>Nr. rreshtash</div>
          </div>
          {list.map((a) => (
            <div key={a._id} className="trow grid-4">
              <div>{String(a.date || "").slice(0, 10)}</div>
              <div>{a.lessonNr}</div>
              <div>
                {a.classId?.name} / {a.subjectId?.name || a.subjectId}
              </div>
              <div>{a.items?.length || 0}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
