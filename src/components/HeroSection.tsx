import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { motion } from 'framer-motion';
import { Search, Wrench, Clock, ChevronDown } from 'lucide-react';
import { AnimatedIcon } from './AnimatedIcon';
import { ZipCodeSearchForm } from './ZipCodeSearchForm';

export const HeroSection = () => {
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Use reliable Unsplash image as primary source
  const mechanicImageUrl = "https://images.unsplash.com/photo-1581092918484-8313de2e71e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
  const fallbackImage = "/placeholder.svg";

  // Debug image loading
  useEffect(() => {
    console.log("Image URL being used:", mechanicImageUrl);
    
    // Preload the image to check if it exists
    const img = new Image();
    img.onload = () => {
      console.log("Image loaded successfully");
      setImageLoaded(true);
    };
    img.onerror = (e) => {
      console.error("Error loading image:", e);
      setImageError(true);
    };
    img.src = mechanicImageUrl;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [mechanicImageUrl]);

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
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
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
              className="flex flex-col sm:flex-row gap-4 mb-16 w-full lg:w-auto"
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
          </div>
          
          {/* Mechanic team image */}
          <motion.div 
            className="order-first lg:order-last mb-8 lg:mb-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-xl -z-10" />
              
              <img 
                src={imageError ? fallbackImage : mechanicImageUrl}
                alt="Professional mechanic working on a vehicle" 
                className="rounded-xl shadow-xl w-full h-auto object-cover aspect-[4/3]"
                onError={() => {
                  console.error("Image failed to load in component");
                  setImageError(true);
                }}
                onLoad={() => {
                  console.log("Image displayed successfully in component");
                  setImageLoaded(true);
                }}
              />
              
              {/* Loading state */}
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Feature Icons */}
        <div className="flex justify-center gap-16 mt-12 mb-12">
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
      
      {/* Zip Code Search Dialog */}
      <ZipCodeSearchForm 
        isOpen={isSearchDialogOpen} 
        onClose={() => setIsSearchDialogOpen(false)} 
      />
    </section>
  );
};
