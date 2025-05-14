
import React, { useState, useEffect } from 'react';
import LoginForm from '@/components/LoginForm';
import AdminSetupForm from '@/components/AdminSetupForm';
import { supabase } from '@/integrations/supabase/client';

const AdminLoginPage: React.FC = () => {
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if admin exists
  useEffect(() => {
    const checkAdminExists = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_roles')
          .select('id')
          .limit(1);
        
        if (error) throw error;
        
        // If data has length, admin exists
        setAdminExists(data && data.length > 0);
      } catch (error) {
        console.error('Error checking admin exists:', error);
        // Default to showing login form on error
        setAdminExists(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminExists();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-boutique-burgundy"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-boutique-burgundy">
          Kev'sCue <span className="text-boutique-gold">Boutique</span>
        </h1>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          {adminExists ? 'Admin Login' : 'Admin Setup'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {adminExists 
            ? 'Secure access to management dashboard' 
            : 'Create your first admin user to access the system'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {adminExists ? <LoginForm role="admin" /> : <AdminSetupForm />}
      </div>
    </div>
  );
};

export default AdminLoginPage;
