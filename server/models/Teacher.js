import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
    phone: { type: String },
    title: { type: String }, // p.sh. "Prof.", "Mësues"
    qualifications: { type: String }, // opsionale
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);
