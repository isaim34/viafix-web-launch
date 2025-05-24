
import React from 'react';
import { motion } from 'framer-motion';

export const HeroImage = () => {
  console.log('HeroImage component rendering...');
  
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
    <div style={{
      position: 'fixed',
      top: '50px',
      right: '50px',
      width: '400px',
      height: '500px',
      backgroundColor: 'red',
      border: '5px solid black',
      zIndex: 9999,
      padding: '20px'
    }}>
      <h1 style={{ color: 'white', fontSize: '24px', marginBottom: '20px' }}>
        HERO IMAGE TEST - CAN YOU SEE THIS?
      </h1>
      
      <div style={{ 
        width: '100%', 
        height: '200px', 
        backgroundColor: 'yellow', 
        border: '3px solid blue',
        marginBottom: '20px'
      }}>
        <p style={{ color: 'black', fontSize: '16px', padding: '10px' }}>Unsplash Image:</p>
        <img 
          src={testImageUrl}
          alt="Test image from Unsplash" 
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ 
            width: '100%', 
            height: '150px', 
            objectFit: 'cover',
            display: 'block',
            border: '2px solid green'
          }}
        />
      </div>
      
      <div style={{ 
        width: '100%', 
        height: '200px', 
        backgroundColor: 'orange', 
        border: '3px solid purple'
      }}>
        <p style={{ color: 'black', fontSize: '16px', padding: '10px' }}>Uploaded Image:</p>
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
            height: '150px', 
            objectFit: 'cover',
            display: 'block',
            border: '2px solid cyan'
          }}
        />
      </div>
    </div>
  );
};
