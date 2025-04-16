import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../config/db";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export const getUsers = async (req: Request, res: Response) => {
    try {
      const result = await pool.query("SELECT * FROM users");
      res.json(result.rows);
    } catch (err: unknown) {
      const error = err as Error;
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

export const registerStudent = async (req: Request, res: Response) => {
    const { email, department } = req.body;
    
    try {
        // Generate verification token
        const verificationToken = jwt.sign(
            { email, department },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Send registration email
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Complete Your Registration",
            html: `
                <h2>Welcome to the Placement Portal!</h2>
                <p>You have been invited to register for the placement portal.</p>
                <p>Please click the link below to complete your registration:</p>
                <a href="${FRONTEND_URL}/student-registration?token=${verificationToken}">
                    Complete Registration
                </a>
                <p>This link will expire in 24 hours.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        
        res.status(200).json({ 
            message: "Invitation sent successfully",
            email: email,
            department: department
        });
    } catch (err: unknown) {
        const error = err as Error;
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export const studentRegistration = async (req: Request, res: Response) => {
  const { email, password, department, name } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert the user and get the inserted row
    const result = await pool.query(
      "INSERT INTO users (email, password, role, department, name) VALUES ($1, $2, 'student', $3, $4) RETURNING id, email, role, department, name",
      [email, hashedPassword, department, name]
    );

    const user = result.rows[0];
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set the token in a cookie
    res.cookie("authToken", token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({ 
      message: "Student registered successfully",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        department: user.department,
        name: user.name
      }
    });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const registerAdmin = async (req: Request, res: Response) => {
  const { email, password, department } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert the user and get the inserted row
    const result = await pool.query(
      "INSERT INTO users (email, password, role, department) VALUES ($1, $2, 'admin', $3) RETURNING id, email, role, department",
      [email, hashedPassword, department]
    );

    const user = result.rows[0];
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set the token in a cookie
    res.cookie("authToken", token, { httpOnly: true, secure: false });

    res.status(201).json({ 
      message: "Admin registered successfully",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        department: user.department
      },
      token
    });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await pool.query("SELECT id, email, department FROM users WHERE role = 'student'");
    res.json(students.rows);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
