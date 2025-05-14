
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-playfair font-bold mb-4 text-boutique-gold">
              Kev'sCue Boutique
            </h3>
            <p className="text-gray-300 mb-4">
              Your fashion destination in Nairobi, Kenya. We offer quality clothing and accessories
              for the fashion-forward individual.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-boutique-gold transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-boutique-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-boutique-gold transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white">Products</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=dresses" className="text-gray-300 hover:text-white">Dresses</Link>
              </li>
              <li>
                <Link to="/products?category=tops" className="text-gray-300 hover:text-white">Tops</Link>
              </li>
              <li>
                <Link to="/products?category=bottoms" className="text-gray-300 hover:text-white">Bottoms</Link>
              </li>
              <li>
                <Link to="/products?category=outerwear" className="text-gray-300 hover:text-white">Outerwear</Link>
              </li>
              <li>
                <Link to="/products?category=accessories" className="text-gray-300 hover:text-white">Accessories</Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-300">Nairobi, Kenya</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 flex-shrink-0" size={18} />
                <a href="tel:+254743455893" className="text-gray-300 hover:text-white">
                  +254 743 455 893
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 flex-shrink-0" size={18} />
                <a href="mailto:info@kevscueboutique.com" className="text-gray-300 hover:text-white">
                  info@kevscueboutique.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Kev'sCue Boutique. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link to="/privacy-policy" className="text-gray-400 text-sm hover:text-white">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-gray-400 text-sm hover:text-white">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
