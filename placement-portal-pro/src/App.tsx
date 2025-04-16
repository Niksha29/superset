import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Landing and Auth Pages
import Landing from "./pages/Landing";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import NotFound from "./pages/NotFound";
import StudentRegistration from "./pages/StudentRegistration";

// Student Pages
import StudentDashboard from "./pages/Student/Dashboard";
import StudentJobs from "./pages/Student/Jobs";
import StudentProfile from "./pages/Student/Profile";
import StudentInterviews from "./pages/Student/Interviews";
import StudentAssessments from "./pages/Student/Assessments";

// Admin Pages
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminRegisterStudents from "./pages/Admin/RegisterStudents";
import AdminCreateMessage from "./pages/Admin/CreateMessage";
import AdminCreateJob from "./pages/Admin/CreateJob";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/student-registration" element={<StudentRegistration />} />

            {/* Student Routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/jobs" element={<StudentJobs />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/interviews" element={<StudentInterviews />} />
            <Route path="/student/assessments" element={<StudentAssessments />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/register-students" element={<AdminRegisterStudents />} />
            <Route path="/admin/create-message" element={<AdminCreateMessage />} />
            <Route path="/admin/create-job" element={<AdminCreateJob />} />

            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;