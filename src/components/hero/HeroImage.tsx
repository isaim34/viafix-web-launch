
import React from 'react';
import { motion } from 'framer-motion';

export const HeroImage = () => {
  // Use the user's preferred team of mechanics image
  const mechanicImageUrl = "/lovable-uploads/a823f63d-8305-41a3-9dff-2fb3349d5dbe.png";

  return (
    <motion.div 
      className="order-first lg:order-last mb-8 lg:mb-0"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-xl -z-10" />
        
        <img 
          src={mechanicImageUrl}
          alt="Professional team of mechanics ready to serve" 
          className="rounded-xl shadow-xl w-full h-auto object-cover aspect-[4/3]"
          onError={(e) => {
            console.error('Image failed to load:', mechanicImageUrl);
            console.log('Error details:', e);
          }}
          onLoad={() => {
            console.log('Image loaded successfully:', mechanicImageUrl);
          }}
        />
      </div>
    </motion.div>
  );
};
