import { Router } from "express";
import {
  createAssignment,
  listAssignments,
  submitAssignment,
  listSubmissions,
  gradeSubmission
} from "../controllers/assignmentController.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

// krijim detyre: mesues/sekt/admin
router.post("/", requireAuth, requireRole("mesues","sekretari","admin"), createAssignment);

// listim detyrash (të gjithë të autentikuarit)
router.get("/", requireAuth, listAssignments);

// dorëzim detyre: nxenes (ose sekt/admin për test)
router.post("/:id/submissions", requireAuth, requireRole("nxenes","sekretari","admin"), submitAssignment);

// listim dorëzimesh të një detyre: mesues/sekt/admin
router.get("/:id/submissions", requireAuth, requireRole("mesues","sekretari","admin"), listSubmissions);

// vlerësim dorëzimi: mesues/sekt/admin
router.patch("/submissions/:id/grade", requireAuth, requireRole("mesues","sekretari","admin"), gradeSubmission);

export default router;
