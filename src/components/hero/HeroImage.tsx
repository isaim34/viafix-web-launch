
import React from 'react';
import { motion } from 'framer-motion';

export const HeroImage = () => {
  // Use a mechanic working on a car image from the project uploads
  const mechanicImageUrl = "/lovable-uploads/489f7032-b400-43c3-a86b-2f163b4ca524.png";

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
          alt="Professional mechanic working on a vehicle" 
          className="rounded-xl shadow-xl w-full h-auto object-cover aspect-[4/3]"
        />
      </div>
    </motion.div>
  );
};
