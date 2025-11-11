import { Router } from "express";
import { createOrUpdateAttendance, getAttendance, deleteAttendance } from "../controllers/attendanceController.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

// Mësues/Sekretari/Admin: krijim/ndryshim
router.post("/:classId/:subjectId", requireAuth, requireRole("mesues","sekretari","admin"), createOrUpdateAttendance);

// Të gjithë të autentikuarit mund të lexojnë (filtruar nga UI sipas rolit)
router.get("/", requireAuth, getAttendance);

// Vetëm admin/sekretari mund të fshijnë
router.delete("/:id", requireAuth, requireRole("sekretari","admin"), deleteAttendance);

export default router;
