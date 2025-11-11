import Attendance from "../models/Attendance.js";
import Grade from "../models/Grade.js";
import Class from "../models/Class.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";

export async function summaryCounts(_req, res) {
  const [classes, teachers, students] = await Promise.all([
    Class.countDocuments(),
    Teacher.countDocuments(),
    Student.countDocuments()
  ]);
  res.json({ classes, teachers, students });
}

export async function avgGrades(_req, res) {
  const pipeline = [
    { $match: { valueNumeric: { $exists: true } } },
    { $group: { _id: "$subjectId", avg: { $avg: "$valueNumeric" }, count: { $sum: 1 } } },
    { $sort: { avg: -1 } }
  ];
  const rows = await Grade.aggregate(pipeline);
  res.json(rows);
}

export async function attendanceByMonth(req, res) {
  const { month, year } = req.query;
  const m = Number(month) || new Date().getMonth() + 1;
  const y = Number(year) || new Date().getFullYear();
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 1);

  const pipeline = [
    { $match: { date: { $gte: start, $lt: end } } },
    { $unwind: "$items" },
    { $group: { _id: "$items.status", total: { $sum: 1 } } }
  ];
  const rows = await Attendance.aggregate(pipeline);
  res.json(rows);
}
