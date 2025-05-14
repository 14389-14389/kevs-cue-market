
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

// Define user types
export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone: string, address: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

// Initialize auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database (to be replaced with real database)
const mockUsers: Record<string, any> = {
  'admin@kevscue.com': { 
    id: '1', 
    name: 'Admin User', 
    email: 'admin@kevscue.com', 
    password: 'admin123', 
    role: 'admin' 
  },
  'customer@example.com': { 
    id: '2', 
    name: 'Customer User', 
    email: 'customer@example.com', 
    password: 'customer123', 
    role: 'customer',
    phone: '+254712345678',
    address: '123 Nairobi St, Kenya'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('kevscueUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data", error);
        localStorage.removeItem('kevscueUser');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string, role?: UserRole): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const normalizedEmail = email.toLowerCase();
      const user = mockUsers[normalizedEmail];
      
      if (!user || user.password !== password) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
        return false;
      }
      
      // If role is specified, check if user has that role
      if (role && user.role !== role) {
        toast({
          title: "Access Denied",
          description: `This account does not have ${role} privileges.`,
          variant: "destructive",
        });
        return false;
      }
      
      // Login successful
      const { password: _, ...userWithoutPassword } = user;
      setUser(userWithoutPassword);
      localStorage.setItem('kevscueUser', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
      });
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (
    name: string, 
    email: string, 
    password: string,
    phone: string,
    address: string
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const normalizedEmail = email.toLowerCase();
      
      // Check if user already exists
      if (mockUsers[normalizedEmail]) {
        toast({
          title: "Registration Failed",
          description: "Account with this email already exists.",
          variant: "destructive",
        });
        return false;
      }
      
      // Create new user
      const newUserId = `user_${Date.now()}`;
      const newUser = {
        id: newUserId,
        name,
        email: normalizedEmail,
        password,
        role: 'customer' as UserRole,
        phone,
        address,
        createdAt: new Date().toISOString()
      };
      
      // Add to mock database
      mockUsers[normalizedEmail] = newUser;
      
      // Save user without password
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('kevscueUser', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Welcome to Kev'sCue Boutique!",
      });
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('kevscueUser');
    navigate('/login');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
