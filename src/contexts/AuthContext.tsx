
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
      
      try {
        // Set up the auth state change listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            console.log("Auth state changed, event:", _event);
            if (session) {
              console.log("Session found in auth change:", session.user.id);
              await setUserData(session.user);
            } else {
              console.log("No session in auth change");
              setUser(null);
              setSupabaseUser(null);
            }
          }
        );
        
        // THEN check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("Existing session found:", session.user.id);
          await setUserData(session.user);
        } else {
          console.log("No existing session found");
        }
        
        setIsLoading(false);
        
        // Cleanup subscription
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsLoading(false);
      }
    };
    
    initializeAuth();
  }, []);
  
  // Helper function to fetch user data and check admin status
  const setUserData = async (supabaseUser: User) => {
    if (!supabaseUser) return;
    
    console.log("Setting user data for:", supabaseUser.id);
    setSupabaseUser(supabaseUser);
    
    try {
      // Check if user is admin
      const { data: adminData, error: adminError } = await supabase
        .rpc('is_admin');
        
      if (adminError) {
        console.error('Error checking admin status:', adminError);
      }
      
      const isAdmin = adminData === true;
      console.log("Is admin check result:", isAdmin);
      
      // Get user profile data
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('name, phone, address, email')
        .eq('user_id', supabaseUser.id)
        .single();
        
      if (profileError) {
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
      
      console.log("User data set successfully with role:", isAdmin ? 'admin' : 'user');
    } catch (error) {
      console.error("Error in setUserData:", error);
    }
  };

  // Register a new user
  const register = async (name: string, email: string, password: string, phone: string, address: string) => {
    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: window.location.origin
        }
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
      console.log("Logging in with email:", email, "and role check:", role);
      
      // Sign in the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error);
        throw error;
      }
      
      console.log("Login successful, checking role requirements");
      
      // If role is specified (e.g., admin), check if user has that role
      if (role === 'admin') {
        console.log("Admin role required, checking permissions");
        const { data: isAdminData, error: adminError } = await supabase
          .rpc('is_admin');
          
        if (adminError) {
          console.error("Admin check error:", adminError);
          throw adminError;
        }
        
        console.log("Admin check result:", isAdminData);
        
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
      
      // Force refresh user data
      await setUserData(data.user);
      
      console.log("Login complete with success");
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
