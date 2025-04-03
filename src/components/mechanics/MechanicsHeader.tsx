
import React from 'react';
import { motion } from 'framer-motion';

const MechanicsHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <h1 className="text-3xl font-bold mb-4">Mobile Auto Mechanics in Austin, TX</h1>
      <p className="text-gray-600 max-w-2xl">
        Browse our network of ASE-certified mobile mechanics in Austin ready to help with your vehicle repairs. Filter by specialty, location, or rating to find the perfect match for your auto repair needs.
      </p>
    </motion.div>
  );
};

export default MechanicsHeader;
