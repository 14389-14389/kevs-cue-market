import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  
  // Load cart from local storage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('kevscueCart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  }, []);
  
  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('kevscueCart', JSON.stringify(items));
  }, [items]);
  
  const addToCart = (product: Product, quantity: number = 1) => {
    setItems(currentItems => {
      // Check if product already exists in cart
      const existingItemIndex = currentItems.findIndex(
        item => item.product.id === product.id
      );
      
      // If product exists, update quantity
      if (existingItemIndex > -1) {
        const newQuantity = currentItems[existingItemIndex].quantity + quantity;
        
        // Check if there's enough stock
        if (newQuantity > product.stock) {
          toast({
            title: "Sorry",
            description: `Only ${product.stock} items available in stock.`,
            variant: "destructive",
          });
          return currentItems;
        }
        
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newQuantity
        };
        
        toast({
          title: "Cart Updated",
          description: `${product.name} quantity updated to ${newQuantity}.`
        });
        
        return updatedItems;
      } 
      // Otherwise, add new item
      else {
        // Check if there's enough stock
        if (quantity > product.stock) {
          toast({
            title: "Sorry",
            description: `Only ${product.stock} items available in stock.`,
            variant: "destructive",
          });
          return currentItems;
        }
        
        toast({
          title: "Added to Cart",
          description: `${product.name} added to your cart.`
        });
        
        return [...currentItems, { product, quantity }];
      }
    });
  };
  
  const removeFromCart = (productId: string) => {
    setItems(currentItems => {
      const updatedItems = currentItems.filter(
        item => item.product.id !== productId
      );
      return updatedItems;
    });
    
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart."
    });
  };
  
  const updateQuantity = (productId: string, quantity: number) => {
    setItems(currentItems => {
      return currentItems.map(item => {
        if (item.product.id === productId) {
          // Check if there's enough stock
          if (quantity > item.product.stock) {
            toast({
              title: "Sorry",
              description: `Only ${item.product.stock} items available in stock.`,
              variant: "destructive",
            });
            return item;
          }
          
          return { ...item, quantity };
        }
        return item;
      });
    });
  };
  
  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart."
    });
  };
  
  // Calculate cart total
  const cartTotal = items.reduce(
    (sum, item) => sum + (item.product.price * item.quantity), 
    0
  );
  
  // Calculate cart count
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);
  
  return (
    <CartContext.Provider 
      value={{ 
        items, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        cartTotal,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
