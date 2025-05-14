
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, ShoppingCart, Menu, X, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Will implement search functionality later
    console.log('Searching for:', searchQuery);
  };

  const menuItems = [
    { title: 'Home', path: '/' },
    { title: 'Products', path: '/products' },
    { title: 'About', path: '/about' },
    { title: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white bg-opacity-95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold text-boutique-burgundy">
              Kev'sCue <span className="text-boutique-gold">Boutique</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className="nav-link text-sm font-medium"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
            <form onSubmit={handleSearch} className="w-full relative">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pr-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                size="sm"
                variant="ghost"
                className="absolute right-0 top-0 h-full"
              >
                <Search size={18} />
              </Button>
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/account" className="hidden md:flex items-center space-x-1">
                  <User size={20} />
                  <span className="text-sm">{user.name.split(' ')[0]}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:inline-flex"
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-boutique-burgundy">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Cart Button */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="sm">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-boutique-burgundy hover:bg-boutique-burgundy">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button className="md:hidden" size="sm" variant="ghost">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-4 border-b">
                    <h2 className="text-lg font-medium">Menu</h2>
                    <SheetClose className="rounded-full hover:bg-gray-200 p-2">
                      <X size={18} />
                    </SheetClose>
                  </div>

                  {/* Mobile Search */}
                  <div className="py-4 border-b">
                    <form onSubmit={handleSearch} className="relative">
                      <Input
                        type="search"
                        placeholder="Search products..."
                        className="w-full pr-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button
                        type="submit"
                        size="sm"
                        variant="ghost"
                        className="absolute right-0 top-0 h-full"
                      >
                        <Search size={18} />
                      </Button>
                    </form>
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex flex-col py-4">
                    {menuItems.map((item) => (
                      <SheetClose key={item.title} asChild>
                        <Link
                          to={item.path}
                          className="py-2 hover:text-primary transition-colors"
                        >
                          {item.title}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>

                  {/* User Actions */}
                  <div className="mt-auto border-t py-4">
                    {user ? (
                      <div className="space-y-4">
                        <SheetClose asChild>
                          <Link to="/account" className="flex items-center space-x-2 py-2">
                            <User size={20} />
                            <span>{user.name}</span>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button
                            onClick={logout}
                            variant="outline"
                            className="w-full"
                          >
                            Logout
                          </Button>
                        </SheetClose>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <SheetClose asChild>
                          <Link to="/login">
                            <Button variant="outline" className="w-full">
                              Login
                            </Button>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link to="/register">
                            <Button className="w-full bg-boutique-burgundy">
                              Register
                            </Button>
                          </Link>
                        </SheetClose>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
