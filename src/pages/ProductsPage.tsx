
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useProducts } from '@/contexts/ProductContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from "@/components/ui/use-toast";

const ProductsPage: React.FC = () => {
  const { products } = useProducts();
  const { addToCart } = useCart();
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortOption, setSortOption] = useState('name-asc');
  
  // Get unique categories
  const categories = ['all', ...Array.from(new Set(products.map(product => product.category)))];
  
  // Get min and max price
  const minPrice = Math.min(...products.map(product => product.price), 0);
  const maxPrice = Math.max(...products.map(product => product.price), 10000);
  
  // Set initial price range
  useEffect(() => {
    if (products.length > 0) {
      setPriceRange([minPrice, maxPrice]);
    }
  }, [products, minPrice, maxPrice]);
  
  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      default:
        return 0;
    }
  });
  
  // Handle add to cart
  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Filter */}
          <div>
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1"
            />
          </div>
          
          {/* Category Filter */}
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger id="category" className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Price Range Filter */}
          <div className="col-span-1 md:col-span-2">
            <Label>Price Range: KSh {priceRange[0]} - KSh {priceRange[1]}</Label>
            <Slider
              value={priceRange}
              min={minPrice}
              max={maxPrice}
              step={100}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="mt-3"
            />
          </div>
        </div>
        
        {/* Sort Options */}
        <div className="mt-4">
          <Label htmlFor="sort">Sort By</Label>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger id="sort" className="w-full md:w-[200px] mt-1">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Product Grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map(product => (
            <Card key={product.id} className="overflow-hidden flex flex-col h-full">
              <Link to={`/products/${product.id}`} className="group">
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img 
                    src={product.image || "/placeholder.svg"} 
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              </Link>
              <CardContent className="p-4 flex-grow flex flex-col">
                <Link 
                  to={`/products/${product.id}`}
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  {product.name}
                </Link>
                <p className="text-muted-foreground text-sm mt-1">{product.category}</p>
                <div className="flex items-center justify-between mt-4 pt-2 border-t">
                  <p className="font-semibold">KSh {product.price.toLocaleString()}</p>
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    variant="outline" 
                    size="sm"
                    disabled={product.stock <= 0}
                  >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-600">No products found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your filters or search term</p>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
