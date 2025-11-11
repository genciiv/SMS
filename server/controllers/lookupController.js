import Class from "../models/Class.js";
import Subject from "../models/Subject.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";

export async function listClasses(_req, res) {
  const rows = await Class.find().sort({ grade: 1, name: 1 });
  res.json(rows.map(c => ({ id: c._id, label: `${c.grade}${c.name.replace(/\D/g,'') ? '' : c.name}`, name: c.name, grade: c.grade })));
}

export async function listSubjects(_req, res) {
  const rows = await Subject.find().sort({ name: 1 });
  res.json(rows.map(s => ({ id: s._id, label: `${s.name}${s.code ? ' ('+s.code+')' : ''}` })));
}

export async function listTeachers(_req, res) {
  const rows = await Teacher.find().populate("user", "firstName lastName").sort({ createdAt: -1 });
  res.json(rows.map(t => ({ id: t._id, label: `${t.user?.firstName ?? ''} ${t.user?.lastName ?? ''}`.trim() || "Mësues", userId: t.user?._id })));
}

export async function listStudents(req, res) {
  const { classId } = req.query;
  const q = {};
  if (classId) q.classId = classId;

  const rows = await Student.find(q).populate("user", "firstName lastName").sort({ "user.lastName": 1 });
  res.json(rows.map(s => ({ id: s._id, label: `${s.user?.firstName ?? ''} ${s.user?.lastName ?? ''}`.trim() || "Nxënës", classId: s.classId })));
}
