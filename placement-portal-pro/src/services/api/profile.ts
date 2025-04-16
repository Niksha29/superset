import axios from "axios";

const API_URL = "http://localhost:5000/api";

export interface Education {
  level: string;
  institution: string;
  year: string;
  percentage: string;
}

export interface Project {
  title: string;
  description: string;
  year: string;
}

export interface Profile {
  name: string;
  email: string;
  phone: string;
  department: string;
  rollNumber: string;
  year: string;
  cgpa: string;
  backlogs: string;
  placementStatus: string;
  address: string;
  skills: string[];
  education: Education[];
  projects: Project[];
}

export const profileApi = {
  getProfile: async (): Promise<Profile> => {
    try {
      const response = await axios.get(`${API_URL}/student/profile`, {
        withCredentials: true
      });
      
      // Transform backend data to match frontend structure
      const data = response.data.profile;
      return {
        name: data.full_name,
        email: data.email || "",
        phone: data.phone_number,
        department: data.department,
        rollNumber: data.roll_number,
        year: data.current_year,
        cgpa: data.cgpa.toString(),
        backlogs: data.backlogs.toString(),
        placementStatus: data.placement_status,
        address: data.address,
        skills: data.skills,
        education: data.education_history.map((edu: any) => ({
          level: edu.level,
          institution: edu.institution,
          year: edu.year,
          percentage: edu.percentage
        })),
        projects: data.projects.map((proj: any) => ({
          title: proj.name,
          description: proj.description,
          year: proj.year
        }))
      };
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  updateProfile: async (profile: Profile): Promise<void> => {
    try {
      // Transform frontend data to match backend structure
      const data = {
        full_name: profile.name,
        phone_number: profile.phone,
        address: profile.address,
        department: profile.department,
        roll_number: profile.rollNumber,
        current_year: profile.year,
        cgpa: parseFloat(profile.cgpa),
        backlogs: parseInt(profile.backlogs),
        placement_status: profile.placementStatus,
        education_history: profile.education.map(edu => ({
          level: edu.level,
          institution: edu.institution,
          year: edu.year,
          percentage: edu.percentage
        })),
        skills: profile.skills,
        projects: profile.projects.map(proj => ({
          name: proj.title,
          description: proj.description,
          year: proj.year
        }))
      };

      await axios.put(`${API_URL}/student/profile`, data, {
        withCredentials: true
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }
}; 