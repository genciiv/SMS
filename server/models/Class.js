import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // p.sh. 10A
    grade: { type: Number, required: true }, // 10, 11, 12
    year: { type: String, required: true }, // p.sh. 2025-2026
    homeroomTeacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  },
  { timestamps: true }
);

export default mongoose.model("Class", classSchema);
