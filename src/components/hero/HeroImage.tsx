
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const HeroImage = () => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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
  );
};
