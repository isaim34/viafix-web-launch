
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NavigationProps {
  isMobile?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ isMobile = false }) => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Mechanics', path: '/mechanics' },
    { name: 'How It Works', path: '/how-it-works' },
  ];

  if (isMobile) {
    return (
      <>
        {navItems.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={item.path}
              className={`block text-sm font-medium py-2 ${
                location.pathname === item.path 
                  ? 'text-primary' 
                  : 'text-gray-700'
              }`}
            >
              {item.name}
            </Link>
          </motion.div>
        ))}
      </>
    );
  }

  return (
    <nav className="hidden md:flex items-center space-x-8">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className={`text-sm font-medium transition-colors hover:text-primary ${
            location.pathname === item.path 
              ? 'text-primary' 
              : 'text-gray-700'
          }`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};
