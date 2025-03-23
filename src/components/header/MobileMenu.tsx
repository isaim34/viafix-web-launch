
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from './Navigation';
import { AuthButtons } from './AuthButtons';

interface MobileMenuProps {
  isOpen: boolean;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="md:hidden glass-card m-2 overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col px-4 py-6 space-y-4">
            <Navigation isMobile={true} />
            <div className="flex flex-col space-y-2 pt-4 border-t">
              <AuthButtons isMobile={true} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
