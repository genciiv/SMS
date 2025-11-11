import mongoose from "mongoose";

const parentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    relation: { type: String, enum: ["nene", "ate", "kujdestar"], default: "kujdestar" },
    phone: { type: String },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  },
  { timestamps: true }
);

export default mongoose.model("Parent", parentSchema);
