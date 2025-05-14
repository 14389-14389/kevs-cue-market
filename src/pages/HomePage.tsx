
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ShoppingBag, Truck, Sparkles } from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';

const HomePage: React.FC = () => {
  const { products } = useProducts();
  
  // Get featured products (just first 3 products for demo)
  const featuredProducts = products.slice(0, 3);
  
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-boutique-cream py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold">
                Discover Your Personal Style at <span className="text-boutique-burgundy">Kev'sCue</span>
              </h1>
              <p className="text-lg text-gray-600">
                Elevate your wardrobe with our curated collection of premium fashion in Nairobi, Kenya.
              </p>
              <div className="flex space-x-4">
                <Link to="/products">
                  <Button className="bg-boutique-burgundy hover:bg-opacity-90">
                    Shop Now
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0">
              <div className="relative w-full h-[400px] bg-gray-200 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  Fashion Image Placeholder
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            <Link to="/products" className="flex items-center text-primary hover:underline">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`}>
                <Card className="card-hover h-full">
                  <div className="aspect-square w-full bg-gray-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      Product Image
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                    <p className="font-medium">KSh {product.price.toLocaleString()}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Shop by Category</h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Accessories'].map((category) => (
              <Link 
                key={category} 
                to={`/products?category=${category.toLowerCase()}`}
                className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow"
              >
                <div className="aspect-square w-full bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                  <span className="text-gray-400">{category}</span>
                </div>
                <h3 className="font-medium">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-boutique-burgundy bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="text-boutique-burgundy" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Products</h3>
              <p className="text-gray-600">
                We curate only the finest clothing and accessories for our discerning customers.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-boutique-burgundy bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <Truck className="text-boutique-burgundy" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Nairobi Delivery</h3>
              <p className="text-gray-600">
                Fast and reliable delivery service throughout Nairobi and surrounding areas.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-boutique-burgundy bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="text-boutique-burgundy" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Unique Style</h3>
              <p className="text-gray-600">
                Discover unique pieces that will make your wardrobe stand out from the crowd.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-boutique-burgundy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="max-w-2xl mx-auto mb-6">
            Subscribe to receive updates on new arrivals, special offers, and fashion tips!
          </p>
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-2 rounded-l-md focus:outline-none text-gray-900"
            />
            <Button className="bg-boutique-gold text-boutique-navy hover:bg-opacity-90 rounded-l-none">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
