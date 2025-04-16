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

export const authApi = {
  login: async (email: string, password: string, role: 'student' | 'admin' | null): Promise<ApiResponse<User>> => {
    try {
      console.log("Login API call", { email, password, role });
      
      // For demonstration, still using dummy data until real API integration
      // Replace this with actual API call when ready
      const userData: User = {
        id: role === 'admin' ? 'admin-123' : 'student-456',
        email,
        name: role === 'admin' ? 'Admin User' : 'Student User',
        role
      };
      
      // When ready to connect to real API, uncomment this:
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
        credentials: 'include'
      });
      return handleResponse<User>(response);
      
      
      // return { data: userData };
    } catch (error) {
      console.error("Login error:", error);
      return { data: {} as User, error: "Failed to connect to login service" };
    }
  },
  
  register: async (userData: any, role: 'student' | 'admin' | null): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      console.log("Register API call", { userData, role });
      
      // When ready to connect to real API, uncomment this:
      let endpoint = '/users/register'; // Default endpoint for students
      if(role === 'admin'){
        endpoint = '/users/register-admin';
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include'
      });
      return handleResponse<{ success: boolean }>(response);
      // return { data: { success: true } };
    } catch (error) {
      console.error("Register error:", error);
      return { data: { success: false }, error: "Failed to connect to registration service" };
    }
  },
  
  getCurrentUser: async (): Promise<ApiResponse<User | null>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) {
        // If not authenticated, return null
        return { data: null };
      }
      
      const data = await response.json();
      // Store the user data in localStorage
      localStorage.setItem('user', JSON.stringify(data));
      return { data };
    } catch (error) {
      console.error("Get current user error:", error);
      return { data: null, error: "Failed to fetch current user" };
    }
  },
  
  logout: async (): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      console.log("Logout API call");
      
      // When ready to connect to real API, uncomment this:
      
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      return handleResponse<{ success: boolean }>(response);
      
      
      return { data: { success: true } };
    } catch (error) {
      console.error("Logout error:", error);
      return { data: { success: false }, error: "Failed to logout" };
    }
  },
  
  updateProfile: async (profileData: any): Promise<ApiResponse<User>> => {
    try {
      console.log("Update profile API call", profileData);
      
      // When ready to connect to real API, uncomment this:
      
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
        credentials: 'include'
      });
      return handleResponse<User>(response);
      
      
      // For demonstration
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const updatedUser = { ...userData, ...profileData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return { data: updatedUser };
      }
      return { data: {} as User, error: "User not found" };
    } catch (error) {
      console.error("Update profile error:", error);
      return { data: {} as User, error: "Failed to update profile" };
    }
  },
  
  getProfile: async (): Promise<ApiResponse<User>> => {
    try {
      // When ready to connect to real API, uncomment this:
      
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        credentials: 'include'
      });
      return handleResponse<User>(response);
      
      
      // For demonstration
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return { data: JSON.parse(storedUser) };
      }
      return { data: {} as User, error: "User not found" };
    } catch (error) {
      console.error("Get profile error:", error);
      return { data: {} as User, error: "Failed to get profile" };
    }
  }
};
