
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home, 
  Briefcase, 
  User, 
  Calendar, 
  Book,
  Mail, 
  LogOut,
  Plus,
  MessageSquare
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const { userRole, logout } = useAuth();
  
  const studentNavItems = [
    { name: "Dashboard", icon: Home, path: "/student/dashboard" },
    { name: "Job Profiles", icon: Briefcase, path: "/student/jobs" },
    { name: "My Profile", icon: User, path: "/student/profile" },
    { name: "Interviews", icon: Calendar, path: "/student/interviews" },
    { name: "Assessments", icon: Book, path: "/student/assessments" },
  ];

  const adminNavItems = [
    { name: "Dashboard", icon: Home, path: "/admin/dashboard" },
    { name: "Student Registration", icon: Plus, path: "/admin/register-students" },
    { name: "Create Message", icon: MessageSquare, path: "/admin/create-message" },
    { name: "Create Job", icon: Briefcase, path: "/admin/create-job" },
  ];

  const navItems = userRole === 'admin' ? adminNavItems : studentNavItems;

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border",
      className
    )}>
      <div className="flex h-full flex-col overflow-y-auto py-5 px-3">
        <div className="mb-8 px-2">
          <h1 className="text-xl font-bold text-foreground">Placement Portal</h1>
          <p className="text-sm text-muted-foreground">{userRole === 'admin' ? 'Admin Panel' : 'Student Portal'}</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                location.pathname === item.path 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-sidebar-foreground"
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="mt-auto border-t border-sidebar-border pt-4">
          <button
            onClick={logout}
            className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};
