
import { Interview, ApiResponse } from "@/types";

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

export const interviewsApi = {
  getInterviews: async (): Promise<ApiResponse<Interview[]>> => {
    try {
      // When ready to connect to real API, uncomment this:
      /*
      const response = await fetch(`${API_BASE_URL}/interviews`, {
        method: 'GET',
        credentials: 'include'
      });
      return handleResponse<Interview[]>(response);
      */
      
      // For demonstration
      const interviews: Interview[] = [
        {
          id: "1",
          company: "TechCorp",
          position: "Software Developer",
          date: new Date(2023, 4, 20),
          status: "scheduled"
        },
        {
          id: "2",
          company: "DataMinds",
          position: "Data Analyst",
          date: new Date(2023, 4, 25),
          status: "scheduled"
        },
        {
          id: "3",
          company: "WebWorks",
          position: "Frontend Developer",
          date: new Date(2023, 4, 15),
          status: "completed",
          notes: "Interview went well. Waiting for feedback."
        }
      ];
      
      return { data: interviews };
    } catch (error) {
      console.error("Get interviews error:", error);
      return { data: [], error: "Failed to fetch interviews" };
    }
  }
};
