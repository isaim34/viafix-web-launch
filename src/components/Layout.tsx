
import React from 'react';
import { Header } from './Header';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const handleSupportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = 'mailto:support@tryviafix.com';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <motion.main 
        className="flex-grow"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
      <footer className="py-6 px-4 sm:px-6 md:px-8 border-t border-gray-100">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} ViaFix. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-500 hover:text-gray-700 transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-gray-700 transition-colors">
                Terms
              </Link>
              <a 
                href="#" 
                onClick={handleSupportClick}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
