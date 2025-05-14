
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import { useCart } from '@/contexts/CartContext';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { getProduct, products } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(productId ? getProduct(productId) : undefined);
  
  // Get related products (same category, excluding current product)
  const relatedProducts = products
    .filter(p => product && p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  
  useEffect(() => {
    // If product doesn't exist, navigate back to products page
    if (!product && productId) {
      navigate('/products');
    }
  }, [product, productId, navigate]);
  
  if (!product) {
    return null;
  }
  
  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity > 0 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };
  
  return (
    <div className="py-8 animate-fade-in">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm">
          <Link to="/" className="hover:underline">Home</Link>
          {' / '}
          <Link to="/products" className="hover:underline">Products</Link>
          {' / '}
          <span>{product.name}</span>
        </div>
        
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Product Image */}
          <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center text-gray-400">
            Product Image
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-xl font-semibold mb-4">KSh {product.price.toLocaleString()}</p>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
            
            <Separator className="my-6" />
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Category</h3>
              <Link 
                to={`/products?category=${product.category}`}
                className="inline-block bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </Link>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Availability</h3>
              <p className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 
                  ? `In Stock (${product.stock} available)` 
                  : 'Out of Stock'}
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </Button>
                <span className="px-6 py-2 border mx-2 rounded text-center w-16">
                  {quantity}
                </span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
            
            <Button 
              className="w-full md:w-auto bg-boutique-burgundy"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="mr-2" size={18} />
              Add to Cart
            </Button>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="card-hover">
                  <Link to={`/products/${relatedProduct.id}`} className="block">
                    <div className="aspect-square w-full bg-gray-100 flex items-center justify-center text-gray-400">
                      Product Image
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold">{relatedProduct.name}</h3>
                      <p className="text-sm text-gray-500 mb-1">{relatedProduct.category}</p>
                      <p className="font-medium">KSh {relatedProduct.price.toLocaleString()}</p>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
