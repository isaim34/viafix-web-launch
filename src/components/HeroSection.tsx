
import React from 'react';
import { motion } from 'framer-motion';
import { HeroContent } from './hero/HeroContent';
import { HeroImage } from './hero/HeroImage';
import { FeatureIcons } from './hero/FeatureIcons';
import { ScrollIndicator } from './hero/ScrollIndicator';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white -z-10" />
      
      {/* Animated shapes */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <motion.div 
          className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-blue-100/30"
          animate={{ 
            y: [0, 15, 0],
            x: [0, -15, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute -left-20 top-1/2 w-40 h-40 rounded-full bg-blue-100/40"
          animate={{ 
            y: [0, -20, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <HeroContent />
          <HeroImage />
        </div>
        
        <FeatureIcons />
        <ScrollIndicator />
      </div>
    </section>
  );
};
