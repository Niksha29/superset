import { Request, Response } from "express";
import { pool } from "../config/db";

interface User {
  id: number;
  role: string;
}

// Extend Express Request type to include user
interface AuthenticatedRequest extends Request {
  user?: User;
}

interface Education {
  level: string;
  institution: string;
  percentage: string;
  year: string;
}

interface Project {
  name: string;
  description: string;
  year: string;
}

interface Profile {
  full_name: string;
  phone_number: string;
  address: string;
  department: string;
  roll_number: string;
  current_year: string;
  cgpa: number;
  backlogs: number;
  placement_status: string;
  education_history: Education[];
  skills: string[];
  projects: Project[];
}

export const createProfile = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.body.user_id;
  const profileData = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Validate CGPA
    if (profileData.cgpa < 0 || profileData.cgpa > 10) {
      return res.status(400).json({ 
        message: "Invalid CGPA value. CGPA must be between 0 and 10" 
      });
    }

    // Validate backlogs
    if (profileData.backlogs < 0) {
      return res.status(400).json({ 
        message: "Invalid backlogs value. Backlogs cannot be negative" 
      });
    }

    const existingProfile = await pool.query(
      "SELECT id FROM profile WHERE user_id = $1",
      [userId]
    );

    if (existingProfile.rows.length > 0) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    // Create new profile
    await pool.query(
      `INSERT INTO profile (
        user_id, full_name, phone_number, address, department, 
        roll_number, current_year, cgpa, backlogs, placement_status, 
        education_history, skills, projects
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        userId,
        profileData.full_name,
        profileData.phone_number,
        profileData.address,
        profileData.department,
        profileData.roll_number,
        profileData.current_year,
        profileData.cgpa,
        profileData.backlogs,
        profileData.placement_status,
        JSON.stringify(profileData.education_history),
        profileData.skills,
        JSON.stringify(profileData.projects)
      ]
    );

    res.status(201).json({ message: "Profile created successfully" });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const profileData: Profile = req.body;

  try {
    // Check if profile exists
    const existingProfile = await pool.query(
      "SELECT id FROM profile WHERE user_id = $1",
      [userId]
    );

    if (existingProfile.rows.length === 0) {
      // Create new profile
      await pool.query(
        `INSERT INTO profile (
          user_id, full_name, phone_number, address, department, 
          roll_number, current_year, cgpa, backlogs, placement_status, 
          education_history, skills, projects
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          userId,
          profileData.full_name,
          profileData.phone_number,
          profileData.address,
          profileData.department,
          profileData.roll_number,
          profileData.current_year,
          profileData.cgpa,
          profileData.backlogs,
          profileData.placement_status,
          JSON.stringify(profileData.education_history),
          profileData.skills,
          JSON.stringify(profileData.projects)
        ]
      );
    } else {
      // Update existing profile
      await pool.query(
        `UPDATE profile SET 
          full_name = $1, phone_number = $2, address = $3, department = $4,
          roll_number = $5, current_year = $6, cgpa = $7, backlogs = $8,
          placement_status = $9, education_history = $10, skills = $11, projects = $12
        WHERE user_id = $13`,
        [
          profileData.full_name,
          profileData.phone_number,
          profileData.address,
          profileData.department,
          profileData.roll_number,
          profileData.current_year,
          profileData.cgpa,
          profileData.backlogs,
          profileData.placement_status,
          JSON.stringify(profileData.education_history),
          profileData.skills,
          JSON.stringify(profileData.projects),
          userId
        ]
      );
    }

    res.json({ message: "Profile updated successfully" });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    const profile = await pool.query(
      "SELECT * FROM profile WHERE user_id = $1",
      [userId]
    );

    if (profile.rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({ profile: profile.rows[0] });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get jobs available for a student based on their department.
 */
export const getAvailableJobs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Get all jobs without department filtering
    const jobs = await pool.query(
      `SELECT id, title, description, departments, posted_date, company, 
      location, salary, requirements, min_cgpa, deadline, exclude_placed, pdf_path 
      FROM jobs 
      ORDER BY posted_date DESC`,
    );

    res.json({ jobs: jobs.rows });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get jobs a student has applied for
 */
export const getAppliedJobs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const studentId = req.user.id;
    const appliedJobs = await pool.query(
      `SELECT DISTINCT ON (j.id)
        j.id, 
        j.title, 
        j.description, 
        j.departments, 
        j.company,
        j.location,
        j.salary,
        j.posted_date,
        j.deadline,
        j.pdf_path,
        ja.status 
       FROM job_applications ja
       JOIN jobs j ON ja.job_id = j.id
       WHERE ja.student_id = $1
       ORDER BY j.id, ja.created_at DESC`,
      [studentId]
    );
  
    res.json({ appliedJobs: appliedJobs.rows });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
  
/**
 * Apply for a job
 */
export const applyForJob = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { jobId } = req.params;
    const studentId = req.user.id;

    // Check if already applied
    const existingApplication = await pool.query(
      "SELECT * FROM job_applications WHERE student_id = $1 AND job_id = $2",
      [studentId, jobId]
    );

    if (existingApplication.rows.length > 0) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    // Insert new application
    await pool.query(
      "INSERT INTO job_applications (student_id, job_id, status) VALUES ($1, $2, 'pending')",
      [studentId, jobId]
    );

    res.json({ message: "Application submitted successfully" });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get application status
 */
export const getApplicationStatus = async (req: Request, res: Response) => {
  const { studentId } = req.params;

  try {
    const applications = await pool.query(
      "SELECT job_id, status FROM job_applications WHERE student_id = $1",
      [studentId]
    );

    res.json({ applications: applications.rows });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get messages sent by admin
 */
export const getMessages = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const studentId = req.user.id;
    
    // Get student's department
    const student = await pool.query("SELECT department FROM users WHERE id = $1", [studentId]);
    
    if (student.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const department = student.rows[0].department;

    // Get all messages and filter based on department
    const messages = await pool.query("SELECT * FROM messages ORDER BY created_at DESC");
    
    // Filter messages where departments array contains 'all' or student's department
    const filteredMessages = messages.rows.filter(message => {
      if (!Array.isArray(message.departments)) {
        try {
          message.departments = JSON.parse(message.departments);
        } catch (e) {
          console.error('Failed to parse departments:', e);
          return false;
        }
      }
      
      return message.departments.includes('all') || message.departments.includes(department);
    });

    res.json({ messages: filteredMessages });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
