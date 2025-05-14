
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createFirstAdmin } from '@/utils/createAdmin';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/components/ui/use-toast";

const AdminSetupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    // Check if passwords match
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create the admin user
      const success = await createFirstAdmin(email, password);
      
      if (success) {
        toast({
          title: "Admin account created",
          description: "Your admin account has been created successfully. You will be logged in automatically.",
        });
        
        // Login as the newly created admin
        const loginSuccess = await login(email, password, 'admin');
        
        if (loginSuccess) {
          // Add a slight delay to ensure the auth context is updated
          setTimeout(() => {
            navigate('/admin/dashboard');
          }, 500);
        } else {
          // If login fails, redirect to admin login page
          toast({
            title: "Login failed",
            description: "Your account was created but automatic login failed. Please login manually.",
          });
          
          setTimeout(() => {
            navigate('/admin/login');
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Error during admin setup:", error);
      toast({
        title: "Setup failed",
        description: "An error occurred during admin setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Admin Setup</CardTitle>
        <CardDescription className="text-center">
          Create your first admin account to access the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input 
              id="admin-email" 
              type="email" 
              placeholder="admin@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input 
              id="admin-password" 
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-confirm-password">Confirm Password</Label>
            <Input 
              id="admin-confirm-password" 
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-boutique-burgundy"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Admin..." : "Create Admin Account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an admin account?{" "}
          <button onClick={() => window.location.reload()} className="text-primary hover:underline">
            Login instead
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default AdminSetupForm;
