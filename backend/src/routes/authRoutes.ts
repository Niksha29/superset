import express, { RequestHandler } from "express";
import { login, logout, getMe } from "../controllers/authController";

const router = express.Router();

// Type assertions for the route handlers
const loginHandler: RequestHandler = login;
const logoutHandler: RequestHandler = logout;
const getMeHandler: RequestHandler = getMe;

router.post("/login", loginHandler);
router.post("/logout", logoutHandler);
router.get("/me", getMeHandler);

export default router;