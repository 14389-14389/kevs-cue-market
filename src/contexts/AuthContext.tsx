
import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from '@supabase/supabase-js';

export type UserRole = 'user' | 'admin';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  register: (name: string, email: string, password: string, phone: string, address: string) => Promise<boolean>;
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  register: async () => false,
  login: async () => false,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);

  // Initialize auth state with session check
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        await setUserData(session.user);
      }
      
      // Listen for auth state changes
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (session) {
            await setUserData(session.user);
          } else {
            setUser(null);
            setSupabaseUser(null);
          }
        }
      );
      
      setIsLoading(false);
      
      // Cleanup subscription
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, []);
  
  // Helper function to fetch user data and check admin status
  const setUserData = async (supabaseUser: User) => {
    if (!supabaseUser) return;
    
    setSupabaseUser(supabaseUser);
    
    // Check if user is admin
    const { data: adminData, error: adminError } = await supabase
      .rpc('is_admin');
      
    const isAdmin = adminData === true;
    
    if (adminError) {
      console.error('Error checking admin status:', adminError);
    }
    
    // Get user profile data
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('name, phone, address, email')
      .eq('user_id', supabaseUser.id)
      .single();
      
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching user profile:', profileError);
    }
    
    // Set user with combined data
    setUser({
      id: supabaseUser.id,
      email: profileData?.email || supabaseUser.email || '',
      name: profileData?.name || 'User',
      phone: profileData?.phone || undefined,
      address: profileData?.address || undefined,
      role: isAdmin ? 'admin' : 'user',
    });
  };

  // Register a new user
  const register = async (name: string, email: string, password: string, phone: string, address: string) => {
    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      if (!data.user) throw new Error('Registration failed');
      
      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          user_id: data.user.id,
          name,
          email,
          phone,
          address
        });
        
      if (profileError) throw profileError;
      
      toast({
        title: "Account created successfully",
        description: "Welcome to Kev'sCue Boutique!",
      });
      
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Login user
  const login = async (email: string, password: string, role?: UserRole) => {
    try {
      // Sign in the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // If role is specified (e.g., admin), check if user has that role
      if (role === 'admin') {
        const { data: isAdminData, error: adminError } = await supabase
          .rpc('is_admin');
          
        if (adminError) throw adminError;
        
        if (!isAdminData) {
          // If not admin, sign out and return error
          await supabase.auth.signOut();
          toast({
            title: "Access denied",
            description: "You do not have admin privileges.",
            variant: "destructive",
          });
          return false;
        }
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back to Kev'sCue Boutique!",
      });
      
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: "Logged out successfully",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during logout.",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    isLoading,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
