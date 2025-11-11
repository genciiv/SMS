import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    term: { type: String, enum: ["Sem I", "Sem II"], required: true },
    type: { type: String, enum: ["detyrë","test","projekt","provim","gojore","praktike"], required: true },
    weight: { type: Number, min: 0, max: 1, required: true },     // p.sh. 0.2
    valueNumeric: { type: Number, min: 4, max: 10 },
    valueLetter: { type: String, enum: ["A","B","C","D","E","F"] },
    date: { type: Date, default: Date.now },
    enteredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    audit: {
      previous: Object,
      changedAt: Date,
      changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }
  },
  { timestamps: true }
);

gradeSchema.index({ studentId: 1, subjectId: 1, term: 1, date: 1 });

export default mongoose.model("Grade", gradeSchema);
