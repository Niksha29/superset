
import { User, ApiResponse } from "@/types";

// Base API URL - replace this with your actual API URL when ready
const API_BASE_URL = "http://localhost:5000/api"; // Update this with your actual API URL

// Helper for handling API responses
const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (!response.ok) {
    const errorData = await response.json();
    return { data: {} as T, error: errorData.message || "An error occurred" };
  }
  const data = await response.json();
  return { data };
};

export const userApi = {
  getAllStudents: async (): Promise<ApiResponse<User[]>> => {
    try {
      // When ready to connect to real API, uncomment this:
      
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: 'GET',
        credentials: 'include'
      });
      return handleResponse<User[]>(response);
      
      
      // For demonstration
      return { data: [
        { id: "s1", name: "John Doe", email: "john@example.com", role: "student" },
        { id: "s2", name: "Jane Smith", email: "jane@example.com", role: "student" },
        { id: "s3", name: "Bob Johnson", email: "bob@example.com", role: "student" },
      ]};
    } catch (error) {
      console.error("Get all students error:", error);
      return { data: [], error: "Failed to fetch students" };
    }
  },
  
  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    try {
      // When ready to connect to real API, uncomment this:
      
      const response = await fetch(`${API_BASE_URL}/all`, {
        method: 'GET',
        credentials: 'include'
      });
      return handleResponse<User[]>(response);
      
      
      // For demonstration
      return { data: [
        { id: "s1", name: "John Doe", email: "john@example.com", role: "student" },
        { id: "s2", name: "Jane Smith", email: "jane@example.com", role: "student" },
        { id: "s3", name: "Bob Johnson", email: "bob@example.com", role: "student" },
        { id: "a1", name: "Admin User", email: "admin@example.com", role: "admin" },
      ]};
    } catch (error) {
      console.error("Get all users error:", error);
      return { data: [], error: "Failed to fetch users" };
    }
  },
  
  registerStudents: async (students: any[]): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      console.log("Register students API call", students);
      
      // When ready to connect to real API, uncomment this:
      
      const response = await fetch(`${API_BASE_URL}/register-students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students }),
        credentials: 'include'
      });
      return handleResponse<{ success: boolean }>(response);
      
      
      return { data: { success: true } };
    } catch (error) {
      console.error("Register students error:", error);
      return { data: { success: false }, error: "Failed to register students" };
    }
  }
};
