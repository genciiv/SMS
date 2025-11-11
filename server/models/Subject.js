import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    gradeRange: [{ type: Number }], // p.sh. [10, 11, 12]
    isElective: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Subject", subjectSchema);
