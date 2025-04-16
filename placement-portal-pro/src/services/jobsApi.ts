import { Job, ApiResponse, AppliedJobsResponse } from "@/types";

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

export const jobsApi = {
  getJobs: async (): Promise<ApiResponse<Job[]>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/jobs/available`, {
        method: 'GET',
        credentials: 'include'
      });
      
      const { data, error } = await handleResponse<{ jobs: Job[] }>(response);
      
      // Return the jobs array from the response
      return { 
        data: data?.jobs || [], 
        error 
      };
    } catch (error) {
      console.error("Get jobs error:", error);
      return { data: [], error: "Failed to fetch jobs" };
    }
  },
  
  getAppliedJobs: async (): Promise<ApiResponse<AppliedJobsResponse>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/jobs/applied`, {
        method: 'GET',
        credentials: 'include'
      });
      return handleResponse<AppliedJobsResponse>(response);
    } catch (error) {
      console.error("Get applied jobs error:", error);
      return { data: { appliedJobs: [] }, error: "Failed to fetch applied jobs" };
    }
  },
  
  applyForJob: async (jobId: string): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      console.log("Apply for job API call", jobId);
      
      // When ready to connect to real API, uncomment this:
      
      const response = await fetch(`${API_BASE_URL}/student/jobs/${jobId}/apply`, {
        method: 'POST',
        credentials: 'include'
      });
      return handleResponse<{ success: boolean }>(response);
      
      
      return { data: { success: true } };
    } catch (error) {
      console.error("Apply for job error:", error);
      return { data: { success: false }, error: "Failed to apply for job" };
    }
  },
  
  createJob: async (formData: FormData): Promise<ApiResponse<Job>> => {
    try {
      console.log("Create job API call", formData);
      
      // When ready to connect to real API, uncomment this:
      
      const response = await fetch(`${API_BASE_URL}/admin/jobs`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      return handleResponse<Job>(response);
      
      
      // For demonstration
      const newJob: Job = {
        id: Math.random().toString(36).substring(2, 9),
        title: formData.get('title') as string,
        company: formData.get('company') as string,
        location: formData.get('location') as string,
        salary: formData.get('salary') as string,
        description: formData.get('description') as string,
        requirements: (formData.get('requirements') as string).split('\n').filter(Boolean),
        departments: JSON.parse(formData.get('departments') as string) as string[],
        minCGPA: parseFloat(formData.get('minCGPA') as string),
        postedDate: new Date(),
        deadline: new Date(formData.get('deadline') as string),
        excludePlaced: formData.get('excludePlaced') === 'true'
      };
      
      return { data: newJob };
    } catch (error) {
      console.error("Create job error:", error);
      return { data: {} as Job, error: "Failed to create job" };
    }
  },
  
  deleteJob: async (id: string): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      console.log("Delete job API call", id);
      
      // When ready to connect to real API, uncomment this:
      
      const response = await fetch(`${API_BASE_URL}/admin/jobs/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      return handleResponse<{ success: boolean }>(response);
      
      
      return { data: { success: true } };
    } catch (error) {
      console.error("Delete job error:", error);
      return { data: { success: false }, error: "Failed to delete job" };
    }
  },
  
  getFilteredJobs: async (studentId: string): Promise<ApiResponse<Job[]>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/filtered-jobs/${studentId}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      const { data, error } = await handleResponse<{ jobs: Job[] }>(response);
      
      // Return the jobs array from the response
      return { 
        data: data?.jobs || [], 
        error 
      };
    } catch (error) {
      console.error("Get filtered jobs error:", error);
      return { data: [], error: "Failed to fetch filtered jobs" };
    }
  },
  
  getApplicationStatus: async (studentId: string): Promise<ApiResponse<any[]>> => {
    try {
      // When ready to connect to real API, uncomment this:
      
      const response = await fetch(`${API_BASE_URL}/student/jobs/${studentId}/status`, {
        method: 'GET',
        credentials: 'include'
      });
      return handleResponse<any[]>(response);
      
      
      // For demonstration
      return { data: [
        { jobId: "1", status: "pending" },
        { jobId: "3", status: "accepted" },
      ]};
    } catch (error) {
      console.error("Get application status error:", error);
      return { data: [], error: "Failed to fetch application status" };
    }
  }
};
