import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";

export async function createAssignment(req, res) {
  try {
    const data = req.body;
    if (!data.classId || !data.subjectId || !data.teacherId || !data.title || !data.dueAt) {
      return res.status(400).json({ message: "Të dhëna të paplota." });
    }
    const doc = await Assignment.create(data);
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function listAssignments(req, res) {
  try {
    const { classId, subjectId, from, to } = req.query;
    const q = {};
    if (classId) q.classId = classId;
    if (subjectId) q.subjectId = subjectId;
    if (from || to) q.dueAt = {};
    if (from) q.dueAt.$gte = new Date(from);
    if (to) q.dueAt.$lte = new Date(to);

    const list = await Assignment.find(q)
      .populate("classId", "name")
      .populate("subjectId", "name code")
      .populate("teacherId", "user")
      .sort({ dueAt: 1 });

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Gabim serveri." });
  }
}

export async function submitAssignment(req, res) {
  try {
    const { id } = req.params; // assignmentId
    const { studentId, files = [] } = req.body;
    if (!studentId) return res.status(400).json({ message: "studentId mungon." });

    const sub = await Submission.findOneAndUpdate(
      { assignmentId: id, studentId },
      { assignmentId: id, studentId, files, submittedAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(sub);
  } catch (err) {
    res.status(500).json({ message: "Gabim serveri." });
  }
}

export async function listSubmissions(req, res) {
  try {
    const { id } = req.params; // assignmentId
    const list = await Submission.find({ assignmentId: id })
      .populate("studentId", "user")
      .sort({ submittedAt: 1 });

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Gabim serveri." });
  }
}

export async function gradeSubmission(req, res) {
  try {
    const { id } = req.params; // submissionId
    const { gradeNumeric, gradeLetter, feedback, gradedBy } = req.body;

    const updated = await Submission.findByIdAndUpdate(
      id,
      { gradeNumeric, gradeLetter, feedback, gradedBy },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
