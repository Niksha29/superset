import { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/services";
import { API_BASE_URL } from "@/services/utils";

type EducationHistory = {
  year: string;
  level: string;
  percentage: string;
  institution: string;
};

type Project = {
  name: string;
  year: string;
  description: string;
};

interface StudentRegistrationData {
  // Basic Info
  name: string;
  email: string;
  password: string;
  department: string;
  phone: string;
  
  // Detailed Info
  full_name: string;
  phone_number: string;
  address: string;
  roll_number: string;
  current_year: string;
  cgpa: string;
  backlogs: number;
  placement_status: string;
  education_history: EducationHistory[];
  skills: string[];
  projects: Project[];
}

interface StudentRegistrationContextType {
  registrationData: StudentRegistrationData;
  updateBasicInfo: (data: Partial<StudentRegistrationData>) => void;
  updateDetailedInfo: (data: Partial<StudentRegistrationData>) => void;
  submitBasicInfo: () => Promise<boolean>;
  submitDetailedInfo: () => Promise<boolean>;
  submitRegistration: () => Promise<boolean>;
  isSubmitting: boolean;
}

// API endpoints - These can be easily updated
const API_ENDPOINTS = {
  BASIC_INFO: `${API_BASE_URL}/student/basic-info`,
  DETAILED_INFO: `${API_BASE_URL}/student/detailed-info`,
  COMPLETE_REGISTRATION: `${API_BASE_URL}/student/register`
};

const defaultRegistrationData: StudentRegistrationData = {
  name: "",
  email: "",
  password: "",
  department: "",
  phone: "",
  
  full_name: "",
  phone_number: "",
  address: "",
  roll_number: "",
  current_year: "",
  cgpa: "",
  backlogs: 0,
  placement_status: "Not Placed",
  education_history: [
    {
      year: "",
      level: "",
      percentage: "",
      institution: ""
    }
  ],
  skills: [],
  projects: [
    {
      name: "",
      year: "",
      description: ""
    }
  ]
};

const StudentRegistrationContext = createContext<StudentRegistrationContextType | undefined>(undefined);

export const StudentRegistrationProvider = ({ children }: { children: ReactNode }) => {
  const [registrationData, setRegistrationData] = useState<StudentRegistrationData>(defaultRegistrationData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const updateBasicInfo = (data: Partial<StudentRegistrationData>) => {
    setRegistrationData(prev => ({
      ...prev,
      ...data,
      // Auto-fill some fields from basic info to detailed info
      full_name: data.name || prev.full_name,
      phone_number: data.phone || prev.phone_number
    }));
  };

  const updateDetailedInfo = (data: Partial<StudentRegistrationData>) => {
    setRegistrationData(prev => ({
      ...prev,
      ...data
    }));
  };

  // Submit only the basic information
  const submitBasicInfo = async (): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      console.log("Submitting basic info:", {
        name: registrationData.name,
        email: registrationData.email,
        password: registrationData.password,
        department: registrationData.department,
        phone: registrationData.phone
      });
      
      // API call for basic info
      const response = await fetch(API_ENDPOINTS.BASIC_INFO, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: registrationData.name,
          email: registrationData.email,
          password: registrationData.password,
          department: registrationData.department,
          phone: registrationData.phone
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit basic information");
      }
      
      toast({
        title: "Basic information saved",
        description: "Please complete your detailed profile.",
      });
      
      return true;
    } catch (error) {
      console.error("Basic info submission error:", error);
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit only the detailed information
  const submitDetailedInfo = async (): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      console.log("Submitting detailed info:", registrationData);
      
      // API call for detailed info
      const response = await fetch(API_ENDPOINTS.DETAILED_INFO, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: registrationData.full_name,
          phone_number: registrationData.phone_number,
          address: registrationData.address,
          roll_number: registrationData.roll_number,
          current_year: registrationData.current_year,
          cgpa: registrationData.cgpa,
          backlogs: registrationData.backlogs,
          placement_status: registrationData.placement_status,
          education_history: registrationData.education_history,
          skills: registrationData.skills,
          projects: registrationData.projects
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit detailed information");
      }
      
      toast({
        title: "Detailed information saved",
        description: "Your profile details have been updated.",
      });
      
      return true;
    } catch (error) {
      console.error("Detailed info submission error:", error);
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit complete registration (both basic and detailed)
  const submitRegistration = async (): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      console.log("Submitting complete registration:", registrationData);
      
      // Either use the built-in auth API or make a direct API call
      // Option 1: Using authApi service
      // const { data, error } = await authApi.register(registrationData, 'student');
      
      // Option 2: Direct API call
      const response = await fetch(API_ENDPOINTS.COMPLETE_REGISTRATION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
      
      toast({
        title: "Registration successful",
        description: "Your profile has been submitted for review.",
      });
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StudentRegistrationContext.Provider
      value={{
        registrationData,
        updateBasicInfo,
        updateDetailedInfo,
        submitBasicInfo,
        submitDetailedInfo,
        submitRegistration,
        isSubmitting
      }}
    >
      {children}
    </StudentRegistrationContext.Provider>
  );
};

export const useStudentRegistration = () => {
  const context = useContext(StudentRegistrationContext);
  if (context === undefined) {
    throw new Error("useStudentRegistration must be used within a StudentRegistrationProvider");
  }
  return context;
};