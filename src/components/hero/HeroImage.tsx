
import React from 'react';
import { motion } from 'framer-motion';

export const HeroImage = () => {
  const mechanicImageUrl = "/lovable-uploads/a823f63d-8305-41a3-9dff-2fb3349d5dbe.png";

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Image failed to load:', mechanicImageUrl);
    console.log('Error details:', e);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log('Image loaded successfully:', mechanicImageUrl);
    const img = e.target as HTMLImageElement;
    console.log('Image natural dimensions:', img.naturalWidth, 'x', img.naturalHeight);
    console.log('Image display dimensions:', img.width, 'x', img.height);
  };

  return (
    <motion.div 
      className="order-first lg:order-last mb-8 lg:mb-0"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="relative bg-gray-100 min-h-[300px] rounded-xl overflow-hidden">
        <img 
          src={mechanicImageUrl}
          alt="Professional team of mechanics ready to serve" 
          className="w-full h-full object-cover rounded-xl shadow-xl"
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ minHeight: '300px' }}
        />
      </div>
    </motion.div>
  );
};
