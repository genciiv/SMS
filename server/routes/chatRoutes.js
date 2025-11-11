import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { getMessages, sendMessage } from "../controllers/chatController.js";

const router = Router();

router.get("/", requireAuth, getMessages);
router.post("/", requireAuth, sendMessage);

export default router;
