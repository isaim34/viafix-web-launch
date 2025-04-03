
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <img 
          src="/lovable-uploads/e3e5d8f9-ed10-4030-8f80-f4d6d309c6e4.png" 
          alt="ViaFix Logo" 
          className="h-12 w-auto" 
        />
      </motion.div>
    </Link>
  );
};
