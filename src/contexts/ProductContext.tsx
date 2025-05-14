import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Export the Product interface so it can be used in other files
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  stock: number;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: (category?: string) => Promise<void>;
  getProduct: (id: string) => Product | undefined;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType>({
  products: [],
  loading: false,
  error: null,
  fetchProducts: async () => {},
  getProduct: () => undefined,
  addProduct: async () => {},
  updateProduct: async () => {},
  deleteProduct: async () => {},
});

export const useProducts = () => useContext(ProductContext);

// Sample products data - will be replaced with data from Supabase
const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Floral Summer Dress',
    price: 2500,
    image: '/placeholder.svg',
    category: 'dresses',
    description: 'A beautiful floral summer dress perfect for sunny days.',
    stock: 10
  },
  // ... other mock products
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (category?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('products')
        .select('*');
        
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setProducts(data as Product[]);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
      // Fallback to mock data if fetch fails
      if (products.length === 0) {
        setProducts(mockProducts);
      }
    } finally {
      setLoading(false);
    }
  };

  const getProduct = (id: string) => {
    return products.find(product => product.id === id);
  };

  const addProduct = async (product: Product) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            description: product.description,
            stock: product.stock
          }
        ])
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        setProducts([...products, data[0] as Product]);
        toast({
          title: "Product added",
          description: "The product has been successfully added."
        });
      }
    } catch (err: any) {
      console.error('Error adding product:', err);
      toast({
        title: "Failed to add product",
        description: err.message || "An error occurred while adding the product.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('products')
        .update({
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          description: product.description,
          stock: product.stock
        })
        .eq('id', product.id);
        
      if (error) throw error;
      
      // Update local state
      setProducts(products.map(p => p.id === product.id ? product : p));
      
      toast({
        title: "Product updated",
        description: "The product has been successfully updated."
      });
    } catch (err: any) {
      console.error('Error updating product:', err);
      toast({
        title: "Failed to update product",
        description: err.message || "An error occurred while updating the product.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setProducts(products.filter(p => p.id !== id));
      
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted."
      });
    } catch (err: any) {
      console.error('Error deleting product:', err);
      toast({
        title: "Failed to delete product",
        description: err.message || "An error occurred while deleting the product.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider 
      value={{ 
        products, 
        loading, 
        error,
        fetchProducts,
        getProduct,
        addProduct,
        updateProduct,
        deleteProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
