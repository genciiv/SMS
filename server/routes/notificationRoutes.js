import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import { createNotification, listNotifications, markAsRead, deleteNotification } from "../controllers/notificationController.js";

const router = Router();

// leximi: të gjithë të autentikuarit (filtrohet nga audience)
router.get("/", requireAuth, listNotifications);

// krijimi: admin / sekretari / mesues
router.post("/", requireAuth, requireRole("admin","sekretari","mesues"), createNotification);

// shënim si lexuar: kushdo i autentikuar
router.post("/:id/read", requireAuth, markAsRead);

// fshirje: admin / sekretari
router.delete("/:id", requireAuth, requireRole("admin","sekretari"), deleteNotification);

export default router;
