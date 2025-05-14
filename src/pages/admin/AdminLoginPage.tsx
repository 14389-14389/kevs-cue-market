
import React from 'react';
import LoginForm from '@/components/LoginForm';

const AdminLoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-boutique-burgundy">
          Kev'sCue <span className="text-boutique-gold">Boutique</span>
        </h1>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          Admin Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Secure access to management dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm role="admin" />
      </div>
    </div>
  );
};

export default AdminLoginPage;
