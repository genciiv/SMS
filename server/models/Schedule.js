import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    // 1=hënë ... 7=e diel
    weekday: { type: Number, min: 1, max: 7, required: true },
    // ora e mësimit në ditë (p.sh. 1..7)
    lessonNr: { type: Number, min: 1, max: 12, required: true },
    // opsionale: orari i saktë në ditë
    startTime: { type: String, default: "" }, // "08:00"
    endTime: { type: String, default: "" },   // "08:45"
    room: { type: String, default: "" },
  },
  { timestamps: true }
);

// parandalon dublikatat për të njëjtin slot
scheduleSchema.index({ classId: 1, weekday: 1, lessonNr: 1 }, { unique: true });

export default mongoose.model("Schedule", scheduleSchema);
