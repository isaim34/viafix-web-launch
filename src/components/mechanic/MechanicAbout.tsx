
import React from 'react';
import { motion } from 'framer-motion';

interface MechanicAboutProps {
  about: string;
  delay?: number;
}

export const MechanicAbout = ({ about, delay = 0.1 }: MechanicAboutProps) => {
  return (
    <motion.div 
      className="glass-card p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <h2 className="text-xl font-bold mb-4">About</h2>
      <p className="text-gray-700">{about}</p>
    </motion.div>
  );
};
