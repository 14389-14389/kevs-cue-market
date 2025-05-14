
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, ShoppingCart, Truck } from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';

const AdminDashboard: React.FC = () => {
  const { products } = useProducts();
  
  // Mock data for the dashboard
  const dashboardData = {
    totalProducts: products.length,
    totalCustomers: 32,
    totalOrders: 57,
    pendingOrders: 8
  };
  
  // Calculate total inventory value
  const totalInventoryValue = products.reduce(
    (total, product) => total + (product.price * product.stock), 
    0
  );
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package size={18} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Inventory value: KSh {totalInventoryValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
            <Users size={18} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active accounts in the system
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart size={18} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Lifetime orders processed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Truck size={18} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.pendingOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Orders awaiting processing
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-boutique-burgundy pl-4 py-1">
                <p className="text-sm font-medium">New Order #KCB0057</p>
                <p className="text-xs text-muted-foreground">14 May, 2025 - 10:24 AM</p>
              </div>
              <div className="border-l-4 border-boutique-burgundy pl-4 py-1">
                <p className="text-sm font-medium">Product Inventory Low: Silk Blouse</p>
                <p className="text-xs text-muted-foreground">13 May, 2025 - 4:12 PM</p>
              </div>
              <div className="border-l-4 border-boutique-burgundy pl-4 py-1">
                <p className="text-sm font-medium">New Customer Registration</p>
                <p className="text-xs text-muted-foreground">13 May, 2025 - 2:58 PM</p>
              </div>
              <div className="border-l-4 border-boutique-burgundy pl-4 py-1">
                <p className="text-sm font-medium">Order #KCB0056 Delivered</p>
                <p className="text-xs text-muted-foreground">12 May, 2025 - 10:15 AM</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Popular Products</CardTitle>
            <CardDescription>
              Your most viewed products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.slice(0, 4).map((product) => (
                <div key={product.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400 mr-3">
                      IMG
                    </div>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium">KSh {product.price.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
