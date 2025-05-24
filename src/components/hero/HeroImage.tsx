
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
    console.log('Image visibility:', window.getComputedStyle(img).visibility);
    console.log('Image display:', window.getComputedStyle(img).display);
    console.log('Image opacity:', window.getComputedStyle(img).opacity);
  };

  return (
    <motion.div 
      className="order-first lg:order-last mb-8 lg:mb-0"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div style={{ width: '100%', height: '400px', backgroundColor: '#f3f4f6', border: '2px solid red' }}>
        <img 
          src={mechanicImageUrl}
          alt="Professional team of mechanics ready to serve" 
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            display: 'block'
          }}
        />
      </div>
    </motion.div>
  );
};
