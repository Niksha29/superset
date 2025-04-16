import express from "express";
import { authenticate } from "../middleware/authMiddleware";
import {
  updateProfile,
  createProfile,
  getProfile,
  getAvailableJobs,
  getAppliedJobs,
  applyForJob,
  getApplicationStatus,
  getMessages,
} from "../controllers/studentController";
import path from "path";

const router = express.Router();

// Define interface for user object from JWT
interface User {
  id: number;
  role: string;
}

// Extend Express Request type to include user
interface AuthenticatedRequest extends express.Request {
  user?: User;
}

// Add middleware to validate user ID matches
const validateUserId = (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction): void => {
  const tokenUserId = req.user?.id;
  const bodyUserId = req.body.user_id;

  if (bodyUserId && tokenUserId && parseInt(bodyUserId) !== tokenUserId) {
    res.status(403).json({ message: "User ID mismatch" });
    return;
  }
  next();
};

// Type assertions for route handlers
const getProfileHandler = getProfile as express.RequestHandler;
const updateProfileHandler = updateProfile as express.RequestHandler;
const getAvailableJobsHandler = getAvailableJobs as express.RequestHandler;
const getAppliedJobsHandler = getAppliedJobs as express.RequestHandler;
const applyForJobHandler = applyForJob as express.RequestHandler;
const getApplicationStatusHandler = getApplicationStatus as express.RequestHandler;
const getMessagesHandler = getMessages as express.RequestHandler;
const createProfileHandler = createProfile as express.RequestHandler;

// Apply authentication middleware to all routes EXCEPT profile creation
router.use((req, res, next) => {
  if (req.path === '/profile' && req.method === 'POST') {
    return next();
  }
  authenticate(req, res, next);
});

// Profile routes
router.post("/profile", createProfileHandler);
router.get("/profile", validateUserId as express.RequestHandler, getProfileHandler);
router.put("/profile", validateUserId as express.RequestHandler, updateProfileHandler);

// Job routes
router.get("/jobs/available", getAvailableJobsHandler);
router.get("/jobs/applied", getAppliedJobsHandler);
router.post("/jobs/:jobId/apply", applyForJobHandler);
router.get("/jobs/:studentId/status", getApplicationStatusHandler);

// Message routes
router.get("/messages", getMessagesHandler);

// Route to serve PDF files
router.get("/jobs/pdf/:filename", (req, res) => {
  const fullPath = decodeURIComponent(req.params.filename);
  // Extract just the filename from the full path
  const filename = path.basename(fullPath);
  const filePath = path.join(__dirname, '../uploads', filename);
  
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(404).json({ message: "File not found" });
    }
  });
});

export default router;
