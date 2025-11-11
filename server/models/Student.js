import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    parents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Parent" }],
    personalNo: { type: String }, // opsionale
    address: { type: String },
    status: { type: String, enum: ["aktiv", "transferuar"], default: "aktiv" },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
