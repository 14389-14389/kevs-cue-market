
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

// Mock customer data
const mockCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+2541234567',
    address: '123 Nairobi St, Kenya',
    createdAt: '2025-05-01'
  },
  {
    id: 'c2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+2547891234',
    address: '456 Mombasa Rd, Kenya',
    createdAt: '2025-05-03'
  },
  {
    id: 'c3',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+2543214567',
    address: '789 Kisumu Ave, Kenya',
    createdAt: '2025-05-05'
  },
  {
    id: 'c4',
    name: 'Robert Brown',
    email: 'robert@example.com',
    phone: '+2549876543',
    address: '101 Nakuru St, Kenya',
    createdAt: '2025-05-08'
  },
  {
    id: 'c5',
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '+2545678901',
    address: '202 Eldoret Rd, Kenya',
    createdAt: '2025-05-10'
  }
];

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  // Filter customers based on search query
  const filteredCustomers = customers.filter(
    customer => 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
  );
  
  // Delete customer
  const handleDelete = (customerId: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      setCustomers(customers.filter(customer => customer.id !== customerId));
      toast({
        title: "Customer Deleted",
        description: "The customer account has been deleted successfully.",
      });
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
            {filteredCustomers.length === 0 ? (
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
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell className="truncate max-w-xs">{customer.address}</TableCell>
                  <TableCell>{customer.createdAt}</TableCell>
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
