import axios from 'axios';

const API_BASE_URL =  'http://localhost:5000/api';

export interface BasicRegistrationData {
  name: string;
  email: string;
  password: string;
  department: string;
  phone: string;
  token?: string;
}

export interface DetailedProfileData {
  full_name: string;
  phone_number: string;
  address: string;
  roll_number: string;
  current_year: string;
  cgpa: string;
  backlogs: number;
  placement_status: string;
  education_history: Array<{
    year: string;
    level: string;
    percentage: string;
    institution: string;
  }>;
  skills: string[];
  projects: Array<{
    name: string;
    year: string;
    description: string;
  }>;
}

export const studentApi = {
  // Initial registration with basic info
  register: async (data: BasicRegistrationData) => {
    const response = await axios.post(`${API_BASE_URL}/users/student-registration`, data);
    return response.data;
  },

  // Update detailed profile
  updateProfile: async (data: DetailedProfileData) => {
    const response = await axios.post(`${API_BASE_URL}/student/profile`, data, {
      withCredentials: true
    });
    return response.data;
  },

  // Verify email with token
  verifyEmail: async (token: string) => {
    const response = await axios.get(`${API_BASE_URL}/students/verify-email/${token}`);
    return response.data;
  },
}; 