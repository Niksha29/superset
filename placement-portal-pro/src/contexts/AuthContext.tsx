import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';
import { authApi } from '@/services';

type UserRole = 'student' | 'admin' | null;

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  userRole: UserRole;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (userData: any, role: UserRole) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data: userData, error } = await authApi.getCurrentUser();
      if (userData && !error) {
        setUser(userData);
        setIsAuthenticated(true);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    try {
      const { data: userData, error } = await authApi.login(email, password, role);
      
      if (error) {
        throw new Error(error);
      }
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast({
        title: "Logged in successfully",
        description: `Welcome ${userData.name}`,
      });
      
      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  const register = async (userData: any, role: UserRole) => {
    try {
      const { error } = await authApi.register(userData, role);
      
      if (error) {
        throw new Error(error);
      }
      
      toast({
        title: "Registration successful",
        description: "You can now log in with your credentials.",
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const logout = async () => {
    try {
      const { error } = await authApi.logout();
      
      if (error) {
        throw new Error(error);
      }
      
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      navigate('/login');
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out.",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (profileData: any) => {
    try {
      const { data: updatedUser, error } = await authApi.updateProfile(profileData);
      
      if (error) {
        throw new Error(error);
      }
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Update profile error:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        userRole: user?.role || null,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
