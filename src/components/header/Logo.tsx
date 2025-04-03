
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
          src="/lovable-uploads/8c83d7f4-0ce4-49c7-90a2-92a24cd5e29a.png" 
          alt="ViaFix Logo" 
          className="h-10 w-auto" 
        />
      </motion.div>
    </Link>
  );
};
