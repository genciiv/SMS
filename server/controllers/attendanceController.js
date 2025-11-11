import Attendance from "../models/Attendance.js";

export async function createOrUpdateAttendance(req, res) {
  try {
    const { classId, subjectId } = req.params;
    const { date, lessonNr, items, teacherId } = req.body;

    if (!date || !lessonNr || !Array.isArray(items) || !teacherId) {
      return res.status(400).json({ message: "Të dhëna të paplota." });
    }

    const doc = await Attendance.findOneAndUpdate(
      { date: new Date(date), lessonNr, classId, subjectId },
      {
        date: new Date(date),
        lessonNr,
        classId,
        subjectId,
        teacherId,
        items,
        enteredBy: req.user.id
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(doc);
  } catch (err) {
    console.error("attendance create/update error:", err);
    res.status(500).json({ message: "Gabim serveri." });
  }
}

export async function getAttendance(req, res) {
  try {
    const { classId, subjectId, date } = req.query;
    const q = {};
    if (classId) q.classId = classId;
    if (subjectId) q.subjectId = subjectId;
    if (date) q.date = new Date(date);

    const list = await Attendance.find(q)
      .populate("classId", "name")
      .populate("subjectId", "name code")
      .populate("items.studentId", "user")
      .sort({ date: -1, lessonNr: -1 });

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Gabim serveri." });
  }
}

export async function deleteAttendance(req, res) {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: "Regjistrimi i prezencës u fshi." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
