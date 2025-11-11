import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    dueAt: { type: Date, required: true },
    attachments: [{ url: String, name: String }]
  },
  { timestamps: true }
);

assignmentSchema.index({ classId: 1, subjectId: 1, dueAt: 1 });

export default mongoose.model("Assignment", assignmentSchema);
