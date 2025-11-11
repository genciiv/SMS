import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import { summaryCounts, avgGrades, attendanceByMonth } from "../controllers/reportController.js";

const router = Router();

// Vetëm admin ose sekretari mund të shohin raportet
router.get("/summary", requireAuth, requireRole("admin","sekretari"), summaryCounts);
router.get("/avg-grades", requireAuth, requireRole("admin","sekretari"), avgGrades);
router.get("/attendance", requireAuth, requireRole("admin","sekretari"), attendanceByMonth);

export default router;
