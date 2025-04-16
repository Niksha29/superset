
import { Event, ApiResponse } from "@/types";

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

export const eventsApi = {
  getUpcomingEvents: async (): Promise<ApiResponse<Event[]>> => {
    try {
      // When ready to connect to real API, uncomment this:
      /*
      const response = await fetch(`${API_BASE_URL}/events/upcoming`, {
        method: 'GET',
        credentials: 'include'
      });
      return handleResponse<Event[]>(response);
      */
      
      // For demonstration
      const events: Event[] = [
        {
          title: "Resume Workshop",
          date: new Date(2023, 4, 12),
          type: "Workshop"
        },
        {
          title: "TechCorp Recruitment Drive",
          date: new Date(2023, 4, 15),
          type: "Recruitment"
        },
        {
          title: "Mock Interview Session",
          date: new Date(2023, 4, 22),
          type: "Interview"
        }
      ];
      
      return { data: events };
    } catch (error) {
      console.error("Get upcoming events error:", error);
      return { data: [], error: "Failed to fetch upcoming events" };
    }
  }
};
