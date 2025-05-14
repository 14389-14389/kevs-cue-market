
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const createFirstAdmin = async (email: string, password: string): Promise<boolean> => {
  try {
    console.log("Creating first admin account with email:", email);
    
    // First register the user through Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + '/admin/login'
      }
    });
    
    if (authError) {
      console.error("Auth error during admin creation:", authError);
      throw authError;
    }
    
    console.log("Auth signup successful, user created:", authData.user?.id);
    
    // Wait for the user to be created
    if (authData.user) {
      // Call the RPC function to make the user an admin
      const { data, error } = await supabase
        .rpc('create_first_admin', { 
          admin_email: email
        });
        
      if (error) {
        console.error("RPC error during admin creation:", error);
        throw error;
      }
      
      console.log("Admin role assigned successfully", data);
      
      toast({
        title: "Admin user created successfully",
        description: `Admin user with email ${email} has been created.`,
      });
      
      // Return success
      return true;
    }
    
    return false;
  } catch (error: any) {
    console.error('Error creating admin user:', error);
    toast({
      title: "Failed to create admin user",
      description: error.message || "An unexpected error occurred.",
      variant: "destructive",
    });
    return false;
  }
};
