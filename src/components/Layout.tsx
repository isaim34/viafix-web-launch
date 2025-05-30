
import React, { useEffect } from 'react';
import Header from './Header';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  
  // Add debug logging
  useEffect(() => {
    console.log("Layout component mounted");
    return () => console.log("Layout component unmounted");
  }, []);

  const handleSupportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const email = 'support@tryviafix.com';
    const subject = 'ViaFix Support Request';
    const body = 'Hello ViaFix Support Team,\n\nI need assistance with...';
    
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      window.location.href = mailtoLink;
    } catch (error) {
      console.error('Failed to open email client:', error);
      alert('Please send an email to support@tryviafix.com');
    }
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
      <footer className="py-8 px-4 sm:px-6 md:px-8 border-t border-gray-100 bg-gradient-to-r from-slate-50 via-blue-50/30 to-indigo-50/50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 font-medium">
              © {new Date().getFullYear()} ViaFix. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-600 hover:text-primary transition-colors font-medium">
                Privacy
              </Link>
              <Link to="/terms" className="text-gray-600 hover:text-primary transition-colors font-medium">
                Terms
              </Link>
              <a 
                href="#" 
                onClick={handleSupportClick}
                className="text-gray-600 hover:text-primary transition-colors font-medium"
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
