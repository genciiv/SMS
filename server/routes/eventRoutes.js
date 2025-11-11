import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import { createEvent, listEvents, deleteEvent } from "../controllers/eventController.js";

const router = Router();

router.get("/", requireAuth, listEvents);
router.post("/", requireAuth, requireRole("admin","sekretari","mesues"), createEvent);
router.delete("/:id", requireAuth, requireRole("admin","sekretari"), deleteEvent);

export default router;
