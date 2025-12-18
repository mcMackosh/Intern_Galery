import React from 'react';
import { Twitter, Facebook, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-700 text-white py-6 mt-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        
        <div className="mb-4 md:mb-0">
          <h1 className="text-xl font-bold">Gallery</h1>
        </div>

        <div className="flex space-x-4 mb-4 md:mb-0">
          <a href="/" className="hover:underline">Main</a>
          <a href="/about" className="hover:underline">About</a>
          <a href="/contact" className="hover:underline">Contats</a>
          <a href="/faq" className="hover:underline">FAQ</a>
        </div>

        <div className="flex space-x-4">
          <a href="#" className="hover:text-gray-400">
            <Twitter size={20} />
          </a>
          <a href="#" className="hover:text-gray-400">
            <Facebook size={20} />
          </a>
          <a href="#" className="hover:text-gray-400">
            <Instagram size={20} />
          </a>
        </div>
      </div>

      <div className="text-center mt-6 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Gallery. All rights is reserved.
      </div>
    </footer>
  );
};

export default Footer;
