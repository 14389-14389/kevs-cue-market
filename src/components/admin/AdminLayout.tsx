
import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Navigation items
  const navItems = [
    { 
      title: 'Dashboard', 
      icon: <LayoutDashboard size={18} />, 
      path: '/admin/dashboard' 
    },
    { 
      title: 'Products', 
      icon: <Package size={18} />, 
      path: '/admin/products' 
    },
    { 
      title: 'Customers', 
      icon: <Users size={18} />, 
      path: '/admin/customers' 
    },
    { 
      title: 'Orders', 
      icon: <ShoppingCart size={18} />, 
      path: '/admin/orders' 
    }
  ];
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:static inset-y-0 left-0 w-64 bg-gray-900 text-white transform transition-transform duration-200 ease-in-out z-20`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <Link to="/admin/dashboard" className="flex items-center">
              <h1 className="text-xl font-bold">KevsCue Admin</h1>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden" 
              onClick={() => setSidebarOpen(false)}
            >
              <X size={18} />
            </Button>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 py-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.title}>
                  <Link
                    to={item.path}
                    className="flex items-center px-4 py-3 hover:bg-gray-800 transition-colors"
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-boutique-gold text-boutique-navy rounded-full flex items-center justify-center mr-2">
                {user?.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar */}
        <header className="bg-white border-b shadow-sm p-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden" 
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} />
            </Button>
            <div>
              <h2 className="text-lg font-medium">Admin Dashboard</h2>
            </div>
            <div className="flex items-center space-x-2">
              <Link to="/" className="text-sm hover:underline">
                View Site
              </Link>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
