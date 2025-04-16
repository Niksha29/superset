export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin' | null;
  department?: string;
  profile?: UserProfile;
}

export interface UserProfile {
  phone?: string;
  address?: string;
  skills?: string[];
  education?: Education[];
  experience?: Experience[];
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
  grade?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

export interface Message {
  id: string;
  title: string;
  content: string;
  date: Date;
  author: string;
  departments?: string[];
  isPinned?: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  departments: string[];
  postedDate: Date;
  posted_date?: Date;
  deadline: Date;
  description: string;
  applied?: boolean;
  requirements?: string[];
  skills?: string[];
  minCGPA?: number;
  excludePlaced?: boolean;
  pdf_path?: string;
  status?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  studentId: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedDate: Date;
}

export interface Event {
  title: string;
  date: Date;
  type: string;
  location?: string;
  description?: string;
}

export interface Interview {
  id: string;
  company: string;
  position: string;
  date: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  location?: string;
  type?: 'online' | 'in-person';
  link?: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  completed: boolean;
  company?: string;
  score?: number;
  feedback?: string;
}

export interface AppliedJobsResponse {
  appliedJobs: Job[];
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}
