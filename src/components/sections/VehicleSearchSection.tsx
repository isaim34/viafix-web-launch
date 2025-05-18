
import React from 'react';
import { motion } from 'framer-motion';
import VINLookupTool from '@/components/customer/VINLookupTool';

export const VehicleSearchSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8 text-center">
          <motion.h2 
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Vehicle Safety Lookup
          </motion.h2>
          <motion.p 
            className="text-gray-600 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Check your vehicle for safety recalls, complaints, and investigations with our free VIN lookup tool
          </motion.p>
        </div>
        <div className="max-w-3xl mx-auto">
          <VINLookupTool />
        </div>
      </div>
    </section>
  );
};
