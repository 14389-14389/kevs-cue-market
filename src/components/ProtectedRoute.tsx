
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-boutique-burgundy"></div>
      </div>
    );
  }
  
  // If no user or if a specific role is required and user doesn't have it
  if (!user || (requiredRole && user.role !== requiredRole)) {
    // Redirect to the appropriate login page
    return <Navigate to={requiredRole === 'admin' ? '/admin/login' : '/login'} />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
