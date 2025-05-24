
import React from 'react';
import { motion } from 'framer-motion';

export const HeroImage = () => {
  // Use the full absolute URL for the image to work in new windows
  const mechanicImageUrl = "https://fb9a69b4-68ac-44ab-886d-235ee8fa0c8c.lovableproject.com/lovable-uploads/a823f63d-8305-41a3-9dff-2fb3349d5dbe.png";

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Image failed to load:', mechanicImageUrl);
    console.log('Error details:', e);
    console.log('Current URL:', window.location.href);
    console.log('Image src attempted:', e.currentTarget.src);
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', mechanicImageUrl);
    console.log('Current URL:', window.location.href);
    console.log('Image dimensions:', document.querySelector('[data-hero-image]')?.getBoundingClientRect());
  };

  return (
    <motion.div 
      className="order-first lg:order-last mb-8 lg:mb-0"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="relative bg-red-100 min-h-[300px] border-2 border-red-500">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-xl -z-10" />
        
        <img 
          data-hero-image
          src={mechanicImageUrl}
          alt="Professional team of mechanics ready to serve" 
          className="rounded-xl shadow-xl w-full h-auto object-cover aspect-[4/3] border-4 border-blue-500"
          onError={handleImageError}
          onLoad={handleImageLoad}
          crossOrigin="anonymous"
          style={{ minHeight: '200px', backgroundColor: 'yellow' }}
        />
      </div>
    </motion.div>
  );
};
