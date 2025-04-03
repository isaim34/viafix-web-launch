
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { AuthButtons } from './AuthButtons';

interface MobileMenuProps {
  isOpen: boolean;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden border-t"
        >
          <div className="px-4 py-4 space-y-3">
            <NavLink 
              to="/"
              className={({ isActive }) => `block py-2 px-3 rounded-md ${
                isActive ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
              }`}
            >
              Home
            </NavLink>
            <NavLink 
              to="/mechanics"
              className={({ isActive }) => `block py-2 px-3 rounded-md ${
                isActive ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
              }`}
            >
              Mechanics
            </NavLink>
            <NavLink 
              to="/how-it-works"
              className={({ isActive }) => `block py-2 px-3 rounded-md ${
                isActive ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
              }`}
            >
              How It Works
            </NavLink>
            
            <div className="pt-4 mt-4 border-t">
              <AuthButtons isMobile={true} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
