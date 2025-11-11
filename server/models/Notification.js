import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, default: "" },
    audience: {
      type: [String],
      enum: ["te_gjithe", "mesues", "nxenes", "prind", "sekretari", "admin"],
      default: ["te_gjithe"]
    },
    // opsionale: targetime specifike
    classIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
    subjectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
