import { useEffect, useState } from "react";
import api from "../lib/api";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Reports() {
  const [summary, setSummary] = useState({});
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    try {
      const [s, g, a] = await Promise.all([
        api.get("/api/reports/summary"),
        api.get("/api/reports/avg-grades"),
        api.get("/api/reports/attendance")
      ]);
      setSummary(s.data);
      setGrades(g.data);
      setAttendance(a.data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Gabim gjatë ngarkimit të raporteve.");
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="page">
      <h1>Raporte & Statistika</h1>

      {err && <div className="form__error">{err}</div>}

      <div className="card">
        <h2>Përmbledhje</h2>
        <div className="grid-3">
          <div className="stat-box">Klasat<br/><b>{summary.classes}</b></div>
          <div className="stat-box">Mësuesit<br/><b>{summary.teachers}</b></div>
          <div className="stat-box">Nxënësit<br/><b>{summary.students}</b></div>
        </div>
      </div>

      <div className="card">
        <h2>Mesatare sipas lëndës</h2>
        <Bar
          data={{
            labels: grades.map(g => g._id),
            datasets: [
              { label: "Mesatare", data: grades.map(g => g.avg.toFixed(2)), backgroundColor: "#4f46e5" }
            ]
          }}
          options={{ responsive: true, scales: { y: { beginAtZero: true, max: 10 } } }}
        />
      </div>

      <div className="card">
        <h2>Prezenca mujore</h2>
        <Pie
          data={{
            labels: attendance.map(a => a._id),
            datasets: [
              { label: "Numër", data: attendance.map(a => a.total), backgroundColor: ["#16a34a","#dc2626","#eab308"] }
            ]
          }}
        />
      </div>
    </div>
  );
}
