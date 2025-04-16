import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import { pool } from "./config/db";
import fileUpload from "express-fileupload";
import path from "path";
import fs from "fs";
import studentRoutes from "./routes/studentRoutes";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ 
  origin: ["http://localhost:8080"], 
  credentials: true 
}));
app.use(cookieParser());

// Configure file upload
app.use(fileUpload({
    createParentPath: true,
    limits: { 
        fileSize: 50 * 1024 * 1024 // 50MB max file size
    },
    abortOnLimit: true,
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "../uploads/temp"),
    debug: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});