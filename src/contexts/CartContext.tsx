
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { sendOrderToWhatsApp } from '@/utils/whatsapp';
import { Product } from './ProductContext';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CheckoutData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  checkout: (data: CheckoutData) => Promise<boolean>;
  deliveryFee: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getCartTotal: () => 0,
  getItemCount: () => 0,
  checkout: async () => false,
  deliveryFee: 150,
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryFee, setDeliveryFee] = useState<number>(150); // Default delivery fee
  const { toast } = useToast();
  const { user } = useAuth();

  // Load delivery fee from Supabase on mount
  useEffect(() => {
    const fetchDeliveryFee = async () => {
      try {
        const { data, error } = await supabase
          .from('delivery_settings')
          .select('base_fee')
          .single();
          
        if (error) throw error;
        
        if (data) {
          setDeliveryFee(data.base_fee);
        }
      } catch (err) {
        console.error('Error fetching delivery fee:', err);
      }
    };
    
    fetchDeliveryFee();
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error parsing cart from localStorage', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Ensure we don't add more than available stock
        const newQuantity = Math.min(existingItem.quantity + quantity, product.stock);
        
        // Show warning if attempting to add more than available
        if (newQuantity < existingItem.quantity + quantity) {
          toast({
            title: "Stock limit reached",
            description: `Only ${product.stock} items are available.`,
            variant: "default",
          });
        }
        
        return prevItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: newQuantity } 
            : item
        );
      } else {
        // Ensure quantity doesn't exceed stock
        const validQuantity = Math.min(quantity, product.stock);
        
        // Show warning if attempting to add more than available
        if (validQuantity < quantity) {
          toast({
            title: "Stock limit reached",
            description: `Only ${product.stock} items are available.`,
            variant: "default",
          });
        }
        
        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart.`,
        });
        
        return [...prevItems, { product, quantity: validQuantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(prevItems => {
      const item = prevItems.find(item => item.product.id === productId);
      
      if (!item) return prevItems;
      
      // Ensure we don't exceed available stock
      const validQuantity = Math.min(quantity, item.product.stock);
      
      if (validQuantity < quantity) {
        toast({
          title: "Stock limit reached",
          description: `Only ${item.product.stock} items are available.`,
          variant: "default",
        });
      }
      
      return prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: validQuantity } 
          : item
      );
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const checkout = async (data: CheckoutData) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to complete your order.",
        variant: "destructive",
      });
      return false;
    }
    
    if (items.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Add some items before checkout.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      const total = getCartTotal();
      
      // Create order in Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total,
          delivery_fee: deliveryFee,
          delivery_address: data.address,
        })
        .select();
        
      if (orderError) throw orderError;
      if (!orderData || orderData.length === 0) throw new Error('Failed to create order');
      
      const orderId = orderData[0].id;
      
      // Create order items
      const orderItems = items.map(item => ({
        order_id: orderId,
        product_id: item.product.id,
        product_name: item.product.name,
        product_price: item.product.price,
        quantity: item.quantity,
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
        
      if (itemsError) throw itemsError;
      
      // Update product stock
      for (const item of items) {
        const newStock = item.product.stock - item.quantity;
        if (newStock < 0) continue; // Skip if somehow went negative
        
        const { error: stockError } = await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.product.id);
          
        if (stockError) console.error('Error updating stock:', stockError);
      }
      
      // Send order to WhatsApp
      sendOrderToWhatsApp(items, data, total, deliveryFee);
      
      // Clear cart after successful checkout
      clearCart();
      
      toast({
        title: "Order completed",
        description: "Your order has been placed successfully!",
      });
      
      return true;
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: error.message || "An error occurred during checkout.",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount,
        checkout,
        deliveryFee,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
