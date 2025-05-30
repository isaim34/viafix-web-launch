
import React from 'react';
import { motion } from 'framer-motion';
import { HeroContent } from './hero/HeroContent';
import { HeroImage } from './hero/HeroImage';
import { FeatureIcons } from './hero/FeatureIcons';
import { ScrollIndicator } from './hero/ScrollIndicator';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Professional background */}
      <div className="absolute inset-0 professional-gradient -z-10" />
      
      {/* Technical grid pattern */}
      <div className="absolute inset-0 tech-grid opacity-40 -z-10" />
      
      {/* Minimal geometric accent */}
      <div className="absolute top-20 right-20 w-32 h-32 border border-slate-200 rotate-12 opacity-20 -z-10" />
      <div className="absolute bottom-20 left-20 w-24 h-24 border border-primary/20 rotate-45 opacity-30 -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <HeroContent />
          <HeroImage />
        </div>
        
        <FeatureIcons />
        <ScrollIndicator />
      </div>
    </section>
  );
};
