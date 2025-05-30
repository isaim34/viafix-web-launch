
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
        {/* Professional badge */}
        <motion.div
          className="bg-slate-100 text-slate-700 border border-slate-200 rounded-md px-4 py-2 mb-8 text-sm font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Professional Auto Repair Platform
        </motion.div>
        
        {/* Heading */}
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-slate-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          ASE-Certified Mechanics, <br/>
          <span className="text-primary">On Demand in Austin</span>
        </motion.h1>
        
        {/* Description */}
        <motion.p 
          className="text-lg text-slate-600 mb-8 max-w-2xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Professional mobile mechanic platform connecting you with certified technicians. 
          Transparent pricing, verified professionals, and on-site service throughout Austin, TX.
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
            className="shadow-sm"
          >
            Find Austin Mechanic
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            icon={<Wrench className="w-4 h-4" />}
            className="border-slate-300 shadow-sm"
          >
            Join as Mechanic
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
