
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Eye } from 'lucide-react';

// Mock order data
interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  orderDate: string;
  total: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  items: OrderItem[];
}

const mockOrders: Order[] = [
  {
    id: 'KCB0057',
    customerName: 'John Doe',
    customerPhone: '+254712345678',
    orderDate: '2025-05-14',
    total: 4500,
    status: 'pending',
    items: [
      { name: 'Floral Summer Dress', price: 2500, quantity: 1 },
      { name: 'Statement Necklace', price: 1200, quantity: 1 },
      { name: 'Silk Blouse', price: 800, quantity: 1 }
    ]
  },
  {
    id: 'KCB0056',
    customerName: 'Jane Smith',
    customerPhone: '+254723456789',
    orderDate: '2025-05-12',
    total: 7000,
    status: 'delivered',
    items: [
      { name: 'Leather Ankle Boots', price: 4500, quantity: 1 },
      { name: 'Slim Fit Jeans', price: 2500, quantity: 1 }
    ]
  },
  {
    id: 'KCB0055',
    customerName: 'Alice Johnson',
    customerPhone: '+254734567890',
    orderDate: '2025-05-10',
    total: 3700,
    status: 'processing',
    items: [
      { name: 'Classic Denim Jacket', price: 3500, quantity: 1 },
      { name: 'Statement Necklace', price: 1200, quantity: 2 }
    ]
  },
  {
    id: 'KCB0054',
    customerName: 'Robert Brown',
    customerPhone: '+254745678901',
    orderDate: '2025-05-08',
    total: 5000,
    status: 'delivered',
    items: [
      { name: 'Floral Summer Dress', price: 2500, quantity: 2 }
    ]
  },
  {
    id: 'KCB0053',
    customerName: 'Emily Davis',
    customerPhone: '+254756789012',
    orderDate: '2025-05-05',
    total: 8200,
    status: 'cancelled',
    items: [
      { name: 'Leather Ankle Boots', price: 4500, quantity: 1 },
      { name: 'Statement Necklace', price: 1200, quantity: 1 },
      { name: 'Silk Blouse', price: 1800, quantity: 1 },
      { name: 'Slim Fit Jeans', price: 2200, quantity: 1 }
    ]
  }
];

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Filter orders based on search query
  const filteredOrders = orders.filter(
    order => 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery)
  );
  
  // View order details
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };
  
  // Get status badge color
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Processing</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="text-green-600 border-green-600">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-red-600 border-red-600">Cancelled</Badge>;
      default:
        return null;
    }
  };
  
  // Update order status (mocked function)
  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
      </div>
      
      {/* Search */}
      <div className="mb-6 relative">
        <Input
          type="search"
          placeholder="Search orders by ID, customer name or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-sm pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>
      
      {/* Orders Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  {searchQuery ? "No matching orders found." : "No orders available."}
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>{order.customerName}</div>
                    <div className="text-sm text-gray-500">{order.customerPhone}</div>
                  </TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>KSh {order.total.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(order)}
                    >
                      <Eye size={14} className="mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Order #{selectedOrder.id}</DialogTitle>
              <DialogDescription>
                Placed on {selectedOrder.orderDate}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Customer Details */}
              <div>
                <h3 className="text-lg font-medium mb-2">Customer Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p>{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p>{selectedOrder.customerPhone}</p>
                  </div>
                </div>
              </div>
              
              {/* Order Status */}
              <div>
                <h3 className="text-lg font-medium mb-2">Order Status</h3>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant={selectedOrder.status === 'pending' ? "default" : "outline"}
                    onClick={() => handleStatusUpdate(selectedOrder.id, 'pending')}
                  >
                    Pending
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedOrder.status === 'processing' ? "default" : "outline"}
                    onClick={() => handleStatusUpdate(selectedOrder.id, 'processing')}
                  >
                    Processing
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedOrder.status === 'delivered' ? "default" : "outline"}
                    onClick={() => handleStatusUpdate(selectedOrder.id, 'delivered')}
                  >
                    Delivered
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedOrder.status === 'cancelled' ? "destructive" : "outline"}
                    className={selectedOrder.status === 'cancelled' ? "" : "text-red-500"}
                    onClick={() => handleStatusUpdate(selectedOrder.id, 'cancelled')}
                  >
                    Cancelled
                  </Button>
                </div>
              </div>
              
              {/* Order Items */}
              <div>
                <h3 className="text-lg font-medium mb-2">Order Items</h3>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>KSh {item.price.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            KSh {(item.price * item.quantity).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">
                          Order Total
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          KSh {selectedOrder.total.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end">
                <Button 
                  onClick={() => {
                    window.open(`https://wa.me/${selectedOrder.customerPhone.replace('+', '')}`, '_blank');
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Contact on WhatsApp
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default OrderManagement;
