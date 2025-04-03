
import React, { useState } from 'react';
import { Button } from './Button';
import { motion } from 'framer-motion';
import { Search, Wrench, Clock, ChevronDown } from 'lucide-react';
import { AnimatedIcon } from './AnimatedIcon';
import { ZipCodeSearchForm } from './ZipCodeSearchForm';

export const HeroSection = () => {
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Chip label */}
          <motion.div
            className="bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-6 text-sm font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Austin's Premier Gig-Based Auto Repair Platform
          </motion.div>
          
          {/* Heading */}
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            ASE-Certified Mechanics, <br/>
            <span className="text-primary">On Demand in Austin</span>
          </motion.h1>
          
          {/* Description */}
          <motion.p 
            className="text-lg text-gray-600 mb-8 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            ViaFix connects you with skilled mobile mechanics who come to your Austin location. Get transparent pricing, ASE-certified professionals, and the convenience of repairs wherever your vehicle is located throughout Austin, TX.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              size="lg" 
              icon={<Search className="w-4 h-4" />}
              onClick={() => setIsSearchDialogOpen(true)}
            >
              Find an Austin Mechanic Now
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              icon={<Wrench className="w-4 h-4" />}
            >
              Join as an Independent Mechanic
            </Button>
          </motion.div>
          
          {/* Feature Icons */}
          <div className="flex justify-center gap-16 mb-12">
            <AnimatedIcon 
              icon={
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <Search className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Find</span>
                </div>
              }
              delay={0.5}
            />
            
            <AnimatedIcon 
              icon={
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <Wrench className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Fix</span>
                </div>
              }
              delay={0.7}
            />
            
            <AnimatedIcon 
              icon={
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Save</span>
                </div>
              }
              delay={0.9}
            />
          </div>
          
          {/* Scroll indicator */}
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
        </div>
      </div>
      
      {/* Zip Code Search Dialog */}
      <ZipCodeSearchForm 
        isOpen={isSearchDialogOpen} 
        onClose={() => setIsSearchDialogOpen(false)} 
      />
    </section>
  );
};
