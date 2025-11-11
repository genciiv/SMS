import Schedule from "../models/Schedule.js";

// CREATE/UPSERT për një slot orari
export async function upsertSlot(req, res) {
  try {
    const { classId, subjectId, teacherId, weekday, lessonNr, startTime = "", endTime = "", room = "" } = req.body;
    if (!classId || !subjectId || !teacherId || !weekday || !lessonNr)
      return res.status(400).json({ message: "Të dhëna të paplota." });

    const updated = await Schedule.findOneAndUpdate(
      { classId, weekday, lessonNr },
      { classId, subjectId, teacherId, weekday, lessonNr, startTime, endTime, room },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(updated);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

// LIST: sipas klase ose mesuesi
export async function listSchedule(req, res) {
  try {
    const { classId, teacherId } = req.query;
    const q = {};
    if (classId) q.classId = classId;
    if (teacherId) q.teacherId = teacherId;

    const rows = await Schedule.find(q)
      .populate("classId", "name grade")
      .populate("subjectId", "name code")
      .populate("teacherId", "user")
      .sort({ weekday: 1, lessonNr: 1 });

    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: "Gabim serveri." });
  }
}

// DELETE slot
export async function deleteSlot(req, res) {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: "Sloti u fshi." });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}
