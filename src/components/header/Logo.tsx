
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-primary rounded-full p-2"
      >
        <span className="text-lg font-bold text-primary-foreground">VF</span>
      </motion.div>
      <span className="font-medium text-lg">ViaFix</span>
    </Link>
  );
};
