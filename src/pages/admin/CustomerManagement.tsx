
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
}

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  // Fetch customers from Supabase
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('users')
          .select('*');
          
        if (error) throw error;
        
        setCustomers(data as Customer[]);
      } catch (err: any) {
        console.error('Error fetching customers:', err);
        toast({
          title: "Failed to load customers",
          description: err.message || "An error occurred while loading customer data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, [toast]);
  
  // Filter customers based on search query
  const filteredCustomers = customers.filter(
    customer => 
      customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.includes(searchQuery)
  );
  
  // Delete customer
  const handleDelete = async (customerId: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      try {
        // Get the auth user_id for this customer
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('user_id')
          .eq('id', customerId)
          .single();
          
        if (userError) throw userError;
        
        if (!userData || !userData.user_id) {
          throw new Error("Could not find user to delete");
        }
        
        // Delete the auth user (this will cascade to delete the profile due to our foreign key)
        const { error: deleteError } = await supabase.auth.admin.deleteUser(
          userData.user_id
        );
        
        if (deleteError) throw deleteError;
        
        // Update local state
        setCustomers(customers.filter(customer => customer.id !== customerId));
        
        toast({
          title: "Customer Deleted",
          description: "The customer account has been deleted successfully.",
        });
      } catch (err: any) {
        console.error('Error deleting customer:', err);
        toast({
          title: "Failed to delete customer",
          description: err.message || "An error occurred while deleting the customer.",
          variant: "destructive"
        });
      }
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Customers</h1>
      </div>
      
      {/* Search */}
      <div className="mb-6 relative">
        <Input
          type="search"
          placeholder="Search customers by name, email or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-sm pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>
      
      {/* Customers Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-boutique-burgundy"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  {searchQuery ? "No matching customers found." : "No customers available."}
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone || 'Not provided'}</TableCell>
                  <TableCell className="truncate max-w-xs">{customer.address || 'Not provided'}</TableCell>
                  <TableCell>{
                    customer.created_at ? 
                      format(new Date(customer.created_at), 'yyyy-MM-dd') : 
                      'Unknown'
                  }</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-500 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleDelete(customer.id)}
                    >
                      <Trash size={14} className="mr-1" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CustomerManagement;
