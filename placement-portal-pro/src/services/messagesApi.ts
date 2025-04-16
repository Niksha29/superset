import { Message, ApiResponse } from "@/types";

// Base API URL - replace this with your actual API URL when ready
const API_BASE_URL = "http://localhost:5000/api";

// Helper for handling API responses
const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (!response.ok) {
    const errorData = await response.json();
    return { data: {} as T, error: errorData.message || "An error occurred" };
  }
  const data = await response.json();
  return { data };
};

// Helper to safely parse dates
const parseDate = (dateString: string | Date): Date => {
  try {
    if (dateString instanceof Date) return dateString;
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  } catch (error) {
    console.error('Error parsing date:', error);
    return new Date();
  }
};

export const messagesApi = {
  getMessages: async (): Promise<ApiResponse<Message[]>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/messages`, {
        method: 'GET',
        credentials: 'include'
      });
      
      const result = await handleResponse<{ messages: Message[] }>(response);
      
      // Extract messages from the response and ensure they're properly formatted
      const messages = Array.isArray(result.data?.messages) 
        ? result.data.messages.map(message => ({
            ...message,
            date: parseDate(message.date)
          }))
        : [];
      
      return { data: messages };
    } catch (error) {
      console.error("Get messages error:", error);
      return { data: [], error: "Failed to fetch messages" };
    }
  },
  
  createMessage: async (message: Omit<Message, 'id' | 'date'>): Promise<ApiResponse<Message>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
        credentials: 'include'
      });
      
      const result = await response.json();
      console.log('Raw create message response:', result);
      
      if (!response.ok) {
        return { data: {} as Message, error: result.message || "Failed to create message" };
      }
      
      // Extract the message data from the response
      if (result.data && result.data.id) {
        return { 
          data: {
            id: result.data.id,
            content: result.data.content,
            departments: result.data.departments,
            title: message.title,
            author: message.author,
            date: new Date(),
            isPinned: message.isPinned
          }
        };
      } else {
        console.error('Invalid response format:', result);
        return { data: {} as Message, error: "Invalid response format" };
      }
    } catch (error) {
      console.error("Create message error:", error);
      return { data: {} as Message, error: "Failed to create message" };
    }
  },
  
  deleteMessage: async (id: string): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/messages/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      return handleResponse<{ success: boolean }>(response);
    } catch (error) {
      console.error("Delete message error:", error);
      return { data: { success: false }, error: "Failed to delete message" };
    }
  },
  
  notifyStudents: async (messageId: string): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      console.log('Calling notify students API for message:', messageId);
      const url = `${API_BASE_URL}/admin/messages/${messageId}/notify`;
      console.log('Notify URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      const result = await handleResponse<{ success: boolean }>(response);
      console.log('Notify API response:', result);
      return result;
    } catch (error) {
      console.error("Notify students error:", error);
      return { data: { success: false }, error: "Failed to notify students" };
    }
  }
};
