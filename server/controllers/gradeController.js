import Grade from "../models/Grade.js";
import { letterToNumeric, numericToLetter } from "../utils/grades.js";

export async function createGrade(req, res) {
  try {
    let {
      studentId, subjectId, teacherId,
      term, type, weight,
      valueNumeric, valueLetter
    } = req.body;

    if (!studentId || !subjectId || !teacherId || !term || !type || weight == null) {
      return res.status(400).json({ message: "Të dhëna të paplota." });
    }

    if (valueLetter && !valueNumeric) valueNumeric = letterToNumeric(valueLetter);
    if (valueNumeric && !valueLetter) valueLetter = numericToLetter(valueNumeric);

    const doc = await Grade.create({
      studentId, subjectId, teacherId, term, type, weight,
      valueNumeric, valueLetter, enteredBy: req.user.id
    });

    res.status(201).json(doc);
  } catch (err) {
    console.error("createGrade error:", err);
    res.status(400).json({ message: err.message });
  }
}

export async function listGrades(req, res) {
  try {
    const { studentId, subjectId, term } = req.query;
    const q = {};
    if (studentId) q.studentId = studentId;
    if (subjectId) q.subjectId = subjectId;
    if (term) q.term = term;

    const list = await Grade.find(q)
      .populate("studentId", "user")
      .populate("subjectId", "name code")
      .populate("teacherId", "user")
      .sort({ date: 1 });

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Gabim serveri." });
  }
}

export async function updateGrade(req, res) {
  try {
    const prev = await Grade.findById(req.params.id);
    if (!prev) return res.status(404).json({ message: "Nota nuk u gjet." });

    const payload = { ...req.body };
    // audit
    payload.audit = {
      previous: {
        valueNumeric: prev.valueNumeric,
        valueLetter: prev.valueLetter,
        weight: prev.weight,
        type: prev.type
      },
      changedAt: new Date(),
      changedBy: req.user.id
    };

    // konsistencë letter<->numeric
    if (payload.valueLetter && !payload.valueNumeric)
      payload.valueNumeric = letterToNumeric(payload.valueLetter);
    if (payload.valueNumeric && !payload.valueLetter)
      payload.valueLetter = numericToLetter(payload.valueNumeric);

    const updated = await Grade.findByIdAndUpdate(req.params.id, payload, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function deleteGrade(req, res) {
  try {
    await Grade.findByIdAndDelete(req.params.id);
    res.json({ message: "Nota u fshi." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
