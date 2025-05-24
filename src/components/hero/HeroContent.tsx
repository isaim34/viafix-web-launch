
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Wrench } from 'lucide-react';
import { Button } from '../Button';
import { ZipCodeSearchForm } from '../ZipCodeSearchForm';

export const HeroContent = () => {
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  return (
    <>
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

      {/* Zip Code Search Dialog */}
      <ZipCodeSearchForm 
        isOpen={isSearchDialogOpen} 
        onClose={() => setIsSearchDialogOpen(false)} 
      />
    </>
  );
};
