
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Trash, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { sendOrderToWhatsApp } from '@/utils/whatsapp';

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deliveryFee, setDeliveryFee] = useState(300); // Default delivery fee in KSh
  
  const handleQuantityChange = (productId: string, amount: number, currentQty: number) => {
    const newQty = currentQty + amount;
    if (newQty > 0) {
      updateQuantity(productId, newQty);
    }
  };
  
  const handleCheckout = () => {
    if (!user) {
      // Redirect to login if not logged in
      navigate('/login');
      return;
    }
    
    if (items.length === 0) {
      return;
    }
    
    // Send order to WhatsApp
    const userDetails = {
      name: user.name,
      email: user.email,
      phone: (user as any).phone || 'Not provided',
      address: (user as any).address || 'Not provided'
    };
    
    sendOrderToWhatsApp(items, userDetails, cartTotal, deliveryFee);
    
    // Clear the cart
    clearCart();
    
    // Redirect to a thank you page (would create this in a real app)
    navigate('/');
  };
  
  return (
    <div className="py-8 animate-fade-in">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag size={64} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products">
              <Button className="bg-boutique-burgundy">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex flex-col sm:flex-row border-b pb-4 last:border-0 last:pb-0">
                      {/* Product Image */}
                      <div className="sm:w-24 h-24 bg-gray-100 flex-shrink-0 mb-4 sm:mb-0 flex items-center justify-center text-gray-400">
                        Product
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-grow sm:ml-4">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold">{item.product.name}</h3>
                            <p className="text-sm text-gray-500">{item.product.category}</p>
                          </div>
                          <p className="font-medium">KSh {item.product.price.toLocaleString()}</p>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleQuantityChange(item.product.id, -1, item.quantity)}
                            >
                              <Minus size={14} />
                            </Button>
                            <span className="px-3">{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleQuantityChange(item.product.id, 1, item.quantity)}
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus size={14} />
                            </Button>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="text-red-500 hover:bg-red-50 hover:text-red-700" 
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>KSh {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>KSh {deliveryFee.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>KSh {(cartTotal + deliveryFee).toLocaleString()}</span>
                  </div>
                  
                  <Button 
                    className="w-full mt-4 bg-boutique-burgundy"
                    onClick={handleCheckout}
                  >
                    {user ? 'Complete Order via WhatsApp' : 'Login to Checkout'}
                  </Button>
                  
                  <p className="text-sm text-center text-gray-500 mt-2">
                    Order confirmation will be sent via WhatsApp
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
