import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} HealthCard. All rights reserved.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center justify-center md:justify-end">
            <p className="text-sm text-gray-500 flex items-center">
              Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> for better healthcare
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;