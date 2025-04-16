import express, { RequestHandler } from "express";
import { registerStudents, createJob, deleteJob, createMessage, deleteMessage, filterJobsForStudents, notifyStudentsOnMessage, getJobApplications } from "../controllers/adminController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

// Type assertion for the authenticate middleware
const authMiddleware: RequestHandler = authenticate;

router.post("/register-students", authMiddleware, registerStudents);
router.post("/jobs", authMiddleware, createJob);
router.delete("/jobs/:id", authMiddleware, deleteJob);
router.get("/jobs/:jobId/applications", authMiddleware, getJobApplications);
router.post("/messages", authMiddleware, createMessage);
router.delete("/messages/:id", authMiddleware, deleteMessage);
router.get("/filtered-jobs/:studentId", authMiddleware, filterJobsForStudents);
router.post("/messages/:id/notify", authMiddleware, notifyStudentsOnMessage);

export default router;