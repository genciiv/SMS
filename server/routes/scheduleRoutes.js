import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import { listSchedule, upsertSlot, deleteSlot } from "../controllers/scheduleController.js";

const router = Router();

router.get("/", requireAuth, listSchedule);
router.post("/", requireAuth, requireRole("admin","sekretari"), upsertSlot);
router.delete("/:id", requireAuth, requireRole("admin","sekretari"), deleteSlot);

export default router;
