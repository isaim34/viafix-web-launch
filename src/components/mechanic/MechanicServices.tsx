
import React from 'react';
import { motion } from 'framer-motion';
import { Service } from '@/types/mechanic';

interface MechanicServicesProps {
  services: Service[];
  delay?: number;
}

export const MechanicServices = ({ services, delay = 0.2 }: MechanicServicesProps) => {
  return (
    <motion.div 
      className="glass-card p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <h2 className="text-xl font-bold mb-4">Services & Pricing</h2>
      <div className="space-y-4">
        {services.map((service, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">{service.name}</span>
            <span className="text-primary font-bold">${service.price}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 text-sm text-gray-500">
        <p>* Base prices listed. Final cost may vary based on vehicle make, model, and condition.</p>
      </div>
    </motion.div>
  );
};
