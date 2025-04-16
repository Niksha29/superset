import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body;
  
  console.log("Login attempt:", { email, role }); // Don't log password for security
  
  try {
    console.log("Querying database for user...");
    const userQuery = await pool.query("SELECT * FROM users WHERE email = $1 AND role = $2", [email, role]);
    console.log("Query result:", userQuery.rows.length > 0 ? "User found" : "No user found");
    
    if (userQuery.rows.length === 0) {
      console.log("No user found with email and role combination");
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    
    const user = userQuery.rows[0];
    console.log("User found in database");
    console.log("Stored hash in DB:", user.password);
    
    // First, let's verify the hash format
    if (!user.password.startsWith('$2b$')) {
      console.log("Error: Password hash in database is not in bcrypt format");
      res.status(500).json({ message: "Server error: Invalid password hash format" });
      return;
    }
    
    console.log("Attempting password comparison...");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password validation result:", isPasswordValid);
    
    if (!isPasswordValid) {
      console.log("Invalid password - the entered password does not match the hash in the database");
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    
    console.log("Login successful, generating token...");
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.cookie("authToken", token, { httpOnly: true, secure: false });
    res.json({ message: "Login successful", role: user.role });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie("authToken");
  res.json({ message: "Logged out successfully" });
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies.authToken;
  if (!token) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
    const userQuery = await pool.query(
      "SELECT id, email, role, name, department FROM users WHERE id = $1", 
      [decoded.id]
    );
    
    if (userQuery.rows.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    
    res.json(userQuery.rows[0]);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(401).json({ message: "Invalid token" });
  }
};