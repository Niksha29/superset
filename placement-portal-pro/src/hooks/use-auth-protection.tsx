import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useAuthProtection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get the stored user from localStorage
    const user = localStorage.getItem('user');
    
    // Only redirect from login page if user is logged in
    if (user && location.pathname === '/login') {
      // Redirect to dashboard based on role
      const userData = JSON.parse(user);
      if (userData.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
      return;
    }

    // Prevent going back to login page
    const preventBackNavigation = (e: PopStateEvent) => {
      if (user && location.pathname === '/login') {
        e.preventDefault();
        window.history.pushState(null, '', location.pathname);
      }
    };

    window.addEventListener('popstate', preventBackNavigation);
    window.history.pushState(null, '', location.pathname);

    return () => {
      window.removeEventListener('popstate', preventBackNavigation);
    };
  }, [navigate, location]);
}; 