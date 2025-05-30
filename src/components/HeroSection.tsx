
import React from 'react';
import { motion } from 'framer-motion';
import { HeroContent } from './hero/HeroContent';
import { HeroImage } from './hero/HeroImage';
import { FeatureIcons } from './hero/FeatureIcons';
import { ScrollIndicator } from './hero/ScrollIndicator';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Enhanced background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 -z-10" />
      
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-40 -z-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e0e7ff' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Animated shapes */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <motion.div 
          className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-gradient-to-br from-blue-200/30 to-indigo-300/20"
          animate={{ 
            y: [0, 15, 0],
            x: [0, -15, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 20,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute -left-20 top-1/2 w-40 h-40 rounded-full bg-gradient-to-br from-purple-200/40 to-blue-300/30"
          animate={{ 
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute right-1/4 bottom-20 w-32 h-32 rounded-full bg-gradient-to-br from-indigo-200/30 to-purple-200/20"
          animate={{ 
            y: [0, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 12,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative">
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
