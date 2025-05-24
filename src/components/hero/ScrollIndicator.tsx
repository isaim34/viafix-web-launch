
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export const ScrollIndicator = () => {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.button
      onClick={scrollToFeatures}
      className="flex flex-col items-center mt-4 text-gray-500 hover:text-gray-700 transition-colors"
      animate={{ y: [0, 8, 0] }}
      transition={{ 
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut"
      }}
    >
      <span className="text-sm mb-2">Discover Austin's Mobile Mechanics</span>
      <ChevronDown className="w-5 h-5" />
    </motion.button>
  );
};
