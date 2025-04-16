import express from "express";
import { registerStudent, getAllStudents,getUsers,registerAdmin,studentRegistration } from "../controllers/userController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();
router.post("/student-registration", studentRegistration);
router.post("/register", registerStudent);
router.post("/register-admin", registerAdmin);
router.get("/students", authenticate, getAllStudents);
router.get("/all", authenticate, getUsers);

export default router;