
import React from 'react';
import { motion } from 'framer-motion';
import { HeroContent } from './hero/HeroContent';
import { HeroImage } from './hero/HeroImage';
import { FeatureIcons } from './hero/FeatureIcons';
import { ScrollIndicator } from './hero/ScrollIndicator';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden mobile-py">
      {/* Professional background */}
      <div className="absolute inset-0 professional-gradient -z-10" />
      
      {/* Technical grid pattern */}
      <div className="absolute inset-0 tech-grid opacity-40 -z-10" />
      
      {/* Minimal geometric accent - hidden on mobile for cleaner look */}
      <div className="absolute top-20 right-20 w-32 h-32 border border-slate-200 rotate-12 opacity-20 -z-10 hidden lg:block" />
      <div className="absolute bottom-20 left-20 w-24 h-24 border border-primary/20 rotate-45 opacity-30 -z-10 hidden lg:block" />
      
      <div className="mobile-container mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <HeroContent />
          <div className="order-first lg:order-last">
            <HeroImage />
          </div>
        </div>
        
        <FeatureIcons />
        <ScrollIndicator />
      </div>
    </section>
  );
};
