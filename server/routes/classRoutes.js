import { Router } from "express";
import {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
} from "../controllers/classController.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

// Vetëm admin ose sekretari mund të krijojnë/ndryshojnë
router.get("/", requireAuth, getClasses);
router.post("/", requireAuth, requireRole("admin", "sekretari"), createClass);
router.put("/:id", requireAuth, requireRole("admin", "sekretari"), updateClass);
router.delete("/:id", requireAuth, requireRole("admin", "sekretari"), deleteClass);

export default router;
