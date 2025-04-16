import { Request, Response } from "express";
import { pool } from "../config/db";
import nodemailer from "nodemailer";
import csvParser from "csv-parser";
import { Readable } from "stream";
import path from "path";
import fs from "fs";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

export const registerStudents = async (req: Request, res: Response): Promise<void> => {
    if (!req.files?.csvFile) {
        res.status(400).json({ message: "No file uploaded" });
        return;
    }

    const csvFile = req.files.csvFile;
    if (Array.isArray(csvFile)) {
        res.status(400).json({ message: "Multiple files not allowed" });
        return;
    }

    const students: { email: string; department: string }[] = [];
    const stream = Readable.from(csvFile.data.toString());
    stream.pipe(csvParser())
        .on("data", (row) => students.push(row))
        .on("end", async () => {
            try {
                for (const { email, department } of students) {
                    await pool.query("INSERT INTO users (email, role, department) VALUES ($1, 'student', $2)", [email, department]);
                    const mailOptions = {
                        from: process.env.EMAIL,
                        to: email,
                        subject: "Registration Link",
                        text: `Please register at: http://localhost:8080/register?email=${email}`,
                    };
                    await transporter.sendMail(mailOptions);
                }
                res.status(201).json({ message: "Students registered and invites sent." });
            } catch (err: unknown) {
                const error = err as Error;
                res.status(500).json({ message: "Server error", error: error.message });
            }
        });
};

export const createJob = async (req: Request, res: Response): Promise<void> => {
    const { title, company, location, salary, description, requirements, departments, minCGPA, deadline, excludePlaced } = req.body;
    
    if (!req.files?.pdfFile) {
        res.status(400).json({ message: "No PDF file uploaded" });
        return;
    }

    const pdfFile = req.files.pdfFile;
    if (Array.isArray(pdfFile)) {
        res.status(400).json({ message: "Multiple files not allowed" });
        return;
    }

    const pdfPath = path.join(uploadsDir, pdfFile.name);
    pdfFile.mv(pdfPath, async (err: Error | null) => {
        if (err) {
            console.error("File upload error:", err);
            res.status(500).json({ message: "File upload failed", error: err.message });
            return;
        }
        try {
            // Convert requirements to array if it's a string
            const requirementsArray = Array.isArray(requirements) ? requirements : [requirements];
            // Parse departments if it's a JSON string, otherwise convert to array
            let departmentsArray: string[];
            try {
                departmentsArray = typeof departments === 'string' ? JSON.parse(departments) : departments;
            } catch (error) {
                departmentsArray = [departments].filter(Boolean);
            }

            const result = await pool.query(
                `INSERT INTO jobs (
                    title, company, location, salary, description, 
                    requirements, departments, min_cgpa, deadline, 
                    exclude_placed, pdf_path
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
                [
                    title,
                    company,
                    location,
                    salary,
                    description,
                    requirementsArray,
                    departmentsArray,
                    minCGPA,
                    deadline,
                    excludePlaced,
                    pdfPath
                ]
            );
            res.status(201).json(result.rows[0]);
        } catch (err: unknown) {
            const error = err as Error;
            console.error("Database error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });
};

export const deleteJob = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    try {
        // Start a transaction
        await pool.query('BEGIN');

        try {
            // First delete all job applications for this job
            await pool.query("DELETE FROM job_applications WHERE job_id = $1", [id]);

            // Then delete the job itself
            const job = await pool.query("SELECT pdf_path FROM jobs WHERE id = $1", [id]);
            if (job.rows.length > 0 && job.rows[0].pdf_path) {
                fs.unlinkSync(job.rows[0].pdf_path);
            }
            
            await pool.query("DELETE FROM jobs WHERE id = $1", [id]);

            // If everything is successful, commit the transaction
            await pool.query('COMMIT');
            
            res.json({ message: "Job deleted successfully" });
        } catch (err) {
            // If there's an error, rollback the transaction
            await pool.query('ROLLBACK');
            throw err;
        }
    } catch (err: unknown) {
        const error = err as Error;
        console.error("Error deleting job:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const createMessage = async (req: Request, res: Response): Promise<void> => {
    const { content, departments } = req.body;
    try {
        console.log('Creating message with data:', { content, departments });
        const result = await pool.query(
            `INSERT INTO messages (content, departments) 
             VALUES ($1, $2) 
             RETURNING id, content, departments`, 
            [content, departments]
        );
        
        console.log('Database result:', result.rows[0]);
        
        res.status(201).json({ 
            message: "Message posted successfully",
            data: {
                id: result.rows[0].id,
                content: result.rows[0].content,
                departments: result.rows[0].departments
            }
        });
    } catch (err: unknown) {
        const error = err as Error;
        console.error("Error creating message:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM messages WHERE id = $1", [id]);
        res.json({ message: "Message deleted successfully" });
    } catch (err: unknown) {
        const error = err as Error;
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const filterJobsForStudents = async (req: Request, res: Response): Promise<void> => {
    const { studentId } = req.params;
    try {
        // First check if student has any offers
        const studentOffers = await pool.query("SELECT COUNT(*) FROM job_offers WHERE student_id = $1", [studentId]);
        if (parseInt(studentOffers.rows[0].count) > 0) {
            res.json({ jobs: [] });
            return;
        }

        // Get student's department
        const studentResult = await pool.query("SELECT department FROM users WHERE id = $1", [studentId]);
        if (studentResult.rows.length === 0) {
            res.status(404).json({ message: "Student not found" });
            return;
        }
        const studentDepartment = studentResult.rows[0].department;

        // Get all jobs and filter based on department
        const jobs = await pool.query("SELECT * FROM jobs");
        
        const filteredJobs = jobs.rows.filter(job => {
            // Parse the departments array properly
            let jobDepartments: string[];
            try {
                // Handle the double-serialized JSON format
                const parsed = JSON.parse(job.departments);
                jobDepartments = Array.isArray(parsed) ? parsed : JSON.parse(parsed);
            } catch (error) {
                console.error("Error parsing departments:", error);
                jobDepartments = [];
            }

            // If job's departments array contains "all", include it
            if (jobDepartments.includes("all")) {
                return true;
            }
            // Otherwise check if job's departments array contains student's department
            return jobDepartments.includes(studentDepartment);
        });
        
        res.json({ jobs: filteredJobs });
    } catch (err: unknown) {
        const error = err as Error;
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const notifyStudentsOnMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        // First get the message to check its departments
        const messageId = req.params.id;
        const message = await pool.query("SELECT departments FROM messages WHERE id = $1", [messageId]);
        
        if (message.rows.length === 0) {
            res.status(404).json({ message: "Message not found" });
            return;
        }

        const departments = message.rows[0].departments;
        
        // If departments includes 'all', notify all students
        // Otherwise, only notify students from selected departments
        const studentsQuery = departments.includes('all')
            ? "SELECT email FROM users WHERE role = 'student'"
            : "SELECT email FROM users WHERE role = 'student' AND department = ANY($1)";
        
        const students = departments.includes('all')
            ? await pool.query(studentsQuery)
            : await pool.query(studentsQuery, [departments]);

        // Send emails to filtered students
        for (const student of students.rows) {
            const mailOptions = {
                from: process.env.EMAIL,
                to: student.email,
                subject: "New Message from Placement Cell",
                text: "A new message has been posted. Please check your dashboard.",
            };
            await transporter.sendMail(mailOptions);
        }

        res.status(200).json({ 
            message: "Notifications sent successfully",
            recipientCount: students.rows.length
        });
    } catch (err: unknown) {
        const error = err as Error;
        console.error("Error sending notifications:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getJobApplications = async (req: Request, res: Response): Promise<void> => {
  const { jobId } = req.params;
  
  try {
    const applications = await pool.query(
      `SELECT 
        ja.id,
        ja.student_id,
        ja.status,
        p.full_name,
        p.roll_number,
        p.department,
        p.cgpa,
        p.backlogs,
        p.phone_number,
        u.email
      FROM job_applications ja
      JOIN profile p ON ja.student_id = p.user_id
      JOIN users u ON ja.student_id = u.id
      WHERE ja.job_id = $1`,
      [jobId]
    );

    const formattedApplications = applications.rows.map(app => ({
      id: app.id,
      studentId: app.student_id,
      status: app.status,
      studentProfile: {
        full_name: app.full_name,
        roll_number: app.roll_number,
        department: app.department,
        cgpa: app.cgpa,
        backlogs: app.backlogs,
        phone_number: app.phone_number,
        email: app.email
      }
    }));

    res.json({ applications: formattedApplications });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ message: "Server error", error: error.message });
  }
};