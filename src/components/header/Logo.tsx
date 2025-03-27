
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
          src="/lovable-uploads/4915728c-953e-47f3-b79d-40efb1ce4950.png" 
          alt="ViaFix Logo" 
          className="h-10 w-auto" 
        />
      </motion.div>
      <span className="font-medium text-lg">ViaFix</span>
    </Link>
  );
};
