import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },             // p.sh. 2025-11-11
    lessonNr: { type: Number, required: true },       // ora e mësimit (1..7)
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    items: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
        status: { type: String, enum: ["prezent", "mungese", "vonesë"], required: true },
        reason: { type: String, default: "" }
      }
    ],
    enteredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

attendanceSchema.index({ date: 1, lessonNr: 1, classId: 1, subjectId: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
