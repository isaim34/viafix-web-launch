
import React from 'react';
import { motion } from 'framer-motion';

export const HeroImage = () => {
  console.log('HeroImage component rendering...');
  
  // Let's try a simple test first
  const testImageUrl = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=400&fit=crop";
  const mechanicImageUrl = "/lovable-uploads/a823f63d-8305-41a3-9dff-2fb3349d5dbe.png";

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('Image failed to load');
    console.log('Error event:', e);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log('Image loaded successfully!');
    const img = e.target as HTMLImageElement;
    console.log('Image src:', img.src);
    console.log('Image complete:', img.complete);
    console.log('Image naturalWidth:', img.naturalWidth);
    console.log('Image naturalHeight:', img.naturalHeight);
  };

  return (
    <motion.div 
      className="order-first lg:order-last mb-8 lg:mb-0"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div style={{ 
        width: '100%', 
        height: '400px', 
        backgroundColor: '#f3f4f6', 
        border: '2px solid red',
        padding: '10px'
      }}>
        <p style={{ color: 'black', marginBottom: '10px' }}>Testing image display:</p>
        
        {/* Test with Unsplash image first */}
        <img 
          src={testImageUrl}
          alt="Test image from Unsplash" 
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ 
            width: '100%', 
            height: '180px', 
            objectFit: 'cover',
            display: 'block',
            marginBottom: '10px',
            border: '1px solid blue'
          }}
        />
        
        {/* Then try the uploaded image */}
        <img 
          src={mechanicImageUrl}
          alt="Professional team of mechanics ready to serve" 
          onError={(e) => {
            console.error('Uploaded image failed to load:', mechanicImageUrl);
            console.log('Error details:', e);
          }}
          onLoad={(e) => {
            console.log('Uploaded image loaded successfully:', mechanicImageUrl);
            const img = e.target as HTMLImageElement;
            console.log('Uploaded image dimensions:', img.naturalWidth, 'x', img.naturalHeight);
          }}
          style={{ 
            width: '100%', 
            height: '180px', 
            objectFit: 'cover',
            display: 'block',
            border: '1px solid green'
          }}
        />
      </div>
    </motion.div>
  );
};
