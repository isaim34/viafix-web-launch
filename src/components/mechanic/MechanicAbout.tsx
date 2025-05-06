
import React from 'react';
import { motion } from 'framer-motion';

interface MechanicAboutProps {
  about: string;
  specialties: string[];
  delay?: number;
}

export const MechanicAbout = ({ about, specialties, delay = 0.1 }: MechanicAboutProps) => {
  return (
    <motion.div 
      className="glass-card p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <h2 className="text-xl font-bold mb-4">About</h2>
      <p className="text-gray-700 mb-4">{about}</p>
      
      {specialties && specialties.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Specialties</h3>
          <div className="flex flex-wrap gap-2">
            {specialties.map((specialty, index) => (
              <span 
                key={index}
                className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
