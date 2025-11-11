import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { listClasses, listSubjects, listTeachers, listStudents } from "../controllers/lookupController.js";

const router = Router();

router.get("/classes", requireAuth, listClasses);
router.get("/subjects", requireAuth, listSubjects);
router.get("/teachers", requireAuth, listTeachers);
router.get("/students", requireAuth, listStudents); // ?classId=<id>

export default router;
