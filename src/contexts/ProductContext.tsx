import React, { createContext, useState, useContext, useEffect } from 'react';

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
  isLoading: boolean;
  error: string | null;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  getProduct: (productId: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
}

// Sample initial product data
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Floral Summer Dress',
    price: 2500,
    image: '/placeholder.svg',
    category: 'dresses',
    description: 'A beautiful floral summer dress, perfect for hot Kenyan days.',
    stock: 15
  },
  {
    id: '2',
    name: 'Classic Denim Jacket',
    price: 3500,
    image: '/placeholder.svg',
    category: 'outerwear',
    description: 'A timeless denim jacket that goes with everything.',
    stock: 10
  },
  {
    id: '3',
    name: 'Leather Ankle Boots',
    price: 4500,
    image: '/placeholder.svg',
    category: 'shoes',
    description: 'Stylish leather ankle boots for all occasions.',
    stock: 8
  },
  {
    id: '4',
    name: 'Statement Necklace',
    price: 1200,
    image: '/placeholder.svg',
    category: 'accessories',
    description: 'A bold statement necklace to elevate any outfit.',
    stock: 20
  },
  {
    id: '5',
    name: 'Silk Blouse',
    price: 1800,
    image: '/placeholder.svg',
    category: 'tops',
    description: 'Elegant silk blouse for formal and casual occasions.',
    stock: 12
  },
  {
    id: '6',
    name: 'Slim Fit Jeans',
    price: 2200,
    image: '/placeholder.svg',
    category: 'bottoms',
    description: 'Classic slim fit jeans with perfect stretch.',
    stock: 25
  }
];

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load products on initial render
  useEffect(() => {
    // Check if we have products in localStorage
    const storedProducts = localStorage.getItem('kevscueProducts');
    
    if (storedProducts) {
      try {
        setProducts(JSON.parse(storedProducts));
      } catch (error) {
        console.error('Failed to parse stored products', error);
        // Fallback to initial products
        setProducts(initialProducts);
      }
    } else {
      // Use initial products if none stored
      setProducts(initialProducts);
      localStorage.setItem('kevscueProducts', JSON.stringify(initialProducts));
    }
    
    setIsLoading(false);
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('kevscueProducts', JSON.stringify(products));
    }
  }, [products]);

  const addProduct = (product: Product) => {
    setProducts(prev => {
      const newProduct = {
        ...product,
        id: product.id || `product_${Date.now()}`
      };
      return [...prev, newProduct];
    });
  };

  const updateProduct = (product: Product) => {
    setProducts(prev => 
      prev.map(p => p.id === product.id ? product : p)
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const getProduct = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const getProductsByCategory = (category: string) => {
    if (category === 'all') return products;
    return products.filter(p => p.category === category);
  };

  return (
    <ProductContext.Provider 
      value={{ 
        products,
        isLoading, 
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        getProductsByCategory
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
