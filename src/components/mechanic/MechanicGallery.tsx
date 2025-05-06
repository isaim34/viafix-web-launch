
import React from 'react';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';

interface MechanicGalleryProps {
  images: string[];
}

export const MechanicGallery = ({ images }: MechanicGalleryProps) => {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6 mb-8"
    >
      <h2 className="text-xl font-bold mb-4">Work Gallery</h2>
      <p className="text-muted-foreground mb-6">Check out some of my recent repair work</p>
      
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <Card className="overflow-hidden border-0 shadow-sm">
                <img 
                  src={image} 
                  alt={`Repair work ${index + 1}`} 
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                />
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </motion.div>
  );
};
