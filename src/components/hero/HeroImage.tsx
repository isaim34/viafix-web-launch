
import React from 'react';
import { motion } from 'framer-motion';

export const HeroImage = () => {
  return (
    <motion.div 
      className="order-first lg:order-last mb-8 lg:mb-0"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="relative">
        <img 
          src="/lovable-uploads/a823f63d-8305-41a3-9dff-2fb3349d5dbe.png"
          alt="Professional team of mechanics ready to serve" 
          className="w-full h-auto rounded-2xl shadow-2xl"
        />
        
        {/* Optional: Add a subtle overlay for better text readability if needed */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl" />
      </div>
    </motion.div>
  );
};
