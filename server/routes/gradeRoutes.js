import { Router } from "express";
import { createGrade, listGrades, updateGrade, deleteGrade } from "../controllers/gradeController.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

// krijim note: mesues/sekt/admin
router.post("/", requireAuth, requireRole("mesues","sekretari","admin"), createGrade);

// lexim notash: të gjithë të autentikuarit (UI filtron sipas rolit)
router.get("/", requireAuth, listGrades);

// përditësim/fshirje note: mesues/sekt/admin
router.patch("/:id", requireAuth, requireRole("mesues","sekretari","admin"), updateGrade);
router.delete("/:id", requireAuth, requireRole("sekretari","admin"), deleteGrade);

export default router;
