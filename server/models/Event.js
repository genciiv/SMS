import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    location: { type: String, default: "" },
    audience: {
      type: [String],
      enum: ["te_gjithe", "mesues", "nxenes", "prind", "sekretari", "admin"],
      default: ["te_gjithe"]
    },
    classIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
    subjectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

eventSchema.index({ startAt: 1, endAt: 1 });

export default mongoose.model("Event", eventSchema);
