
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
          src="/lovable-uploads/b991d0cd-8d45-457b-a5c9-db342ae34022.png" 
          alt="ViaFix Logo" 
          className="h-10 w-auto" 
        />
      </motion.div>
    </Link>
  );
};
