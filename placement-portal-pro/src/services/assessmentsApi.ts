
import { Assessment, ApiResponse } from "@/types";

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

export const assessmentsApi = {
  getAssessments: async (): Promise<ApiResponse<Assessment[]>> => {
    try {
      // When ready to connect to real API, uncomment this:
      /*
      const response = await fetch(`${API_BASE_URL}/assessments`, {
        method: 'GET',
        credentials: 'include'
      });
      return handleResponse<Assessment[]>(response);
      */
      
      // For demonstration
      const assessments: Assessment[] = [
        {
          id: "1",
          title: "Technical Assessment - TechCorp",
          description: "Complete the coding challenges to proceed to the next round.",
          deadline: new Date(2023, 4, 18),
          completed: false
        },
        {
          id: "2",
          title: "Aptitude Test - DataMinds",
          description: "Test your analytical skills with this aptitude assessment.",
          deadline: new Date(2023, 4, 20),
          completed: false
        },
        {
          id: "3",
          title: "Frontend Challenge - WebWorks",
          description: "Build a responsive dashboard using React.",
          deadline: new Date(2023, 4, 12),
          completed: true
        }
      ];
      
      return { data: assessments };
    } catch (error) {
      console.error("Get assessments error:", error);
      return { data: [], error: "Failed to fetch assessments" };
    }
  },
  
  markAssessmentCompleted: async (id: string): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      console.log("Mark assessment completed API call", id);
      
      // When ready to connect to real API, uncomment this:
      /*
      const response = await fetch(`${API_BASE_URL}/assessments/${id}/complete`, {
        method: 'POST',
        credentials: 'include'
      });
      return handleResponse<{ success: boolean }>(response);
      */
      
      return { data: { success: true } };
    } catch (error) {
      console.error("Mark assessment completed error:", error);
      return { data: { success: false }, error: "Failed to mark assessment as completed" };
    }
  }
};
